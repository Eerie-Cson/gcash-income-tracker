import { Inject, Injectable } from '@nestjs/common';
import { Token } from './repository/token';
import { WalletRepository } from './repository/wallet.repository';
import { WalletController } from './wallet.controller';

@Injectable()
export class WalletService {
  constructor(
    @Inject(Token.WalletRepository)
    private readonly walletRepository: WalletRepository,
  ) {}

  async create(
    params: Parameters<WalletController['create']>[0],
  ): Promise<boolean> {
    return this.walletRepository.create({
      data: {
        balance: params.balance || 0,
        type: params.type,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
