import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../account/repository/account.repository';
import { Token as AccountToken } from '../account/repository/token';
import { Token as WalletToken } from './repository/token';
import { WalletRepository } from './repository/wallet.repository';
import { WalletController } from './wallet.controller';

@Injectable()
export class WalletService {
  constructor(
    @Inject(WalletToken.WalletRepository)
    private readonly walletRepository: WalletRepository,
    @Inject(AccountToken.AccountRepository)
    private accountRepository: AccountRepository,
  ) {}

  async create(
    params: Parameters<WalletController['create']>[0],
  ): Promise<boolean> {
    // const account = await this.accountRepository.findSeedAccount();

    // if (!account) {
    //   throw new Error('Seed account not found');
    // }

    const account = '7cf43eef-5759-4659-8d9a-d66c711b9705';
    if (params.balance && params.balance < 0) {
      throw new Error('Balance cannot be negative');
    }

    return this.walletRepository.create({
      data: {
        balance: params.balance || 0,
        type: params.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: account,
      },
    });
  }
}
