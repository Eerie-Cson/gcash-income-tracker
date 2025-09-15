import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { Wallet, WalletType } from '../libs/types';
import { Token as WalletToken } from './repository/token';
import { WalletRepository } from './repository/wallet.repository';

@Injectable()
export class WalletService {
  constructor(
    @Inject(WalletToken.WalletRepository)
    private readonly walletRepository: WalletRepository,
    private accountService: AccountService,
  ) {}

  async createWallet(params: {
    balance: number;
    accountId: string;
    type: WalletType;
  }): Promise<Wallet> {
    const account = await this.accountService.findById(params.accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.walletRepository.create({
      data: {
        balance: params.balance || 0,
        type: params.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: params.accountId,
      },
    });
  }

  async createGcashWallet(balance: number, accountId: string) {
    if (balance && balance < 0) {
      throw new BadRequestException('Balance cannot be negative');
    }

    return this.createWallet({
      balance,
      accountId: accountId,
      type: WalletType.GCASH,
    });
  }

  async createCashWallet(balance: number, accountId: string) {
    if (balance && balance < 0) {
      throw new BadRequestException('Balance cannot be negative');
    }

    return this.createWallet({
      balance,
      accountId: accountId,
      type: WalletType.CASH,
    });
  }
}
