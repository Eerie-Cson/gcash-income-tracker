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

    const wallets = await this.walletRepository.findAccountWallets(account.id);

    const hasWalletType = wallets?.some((w) => w.type === params.type);
    if (hasWalletType) {
      throw new BadRequestException(
        `Account already has a ${params.type} wallet`,
      );
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

  async findWalletForUpdate(client, accountId: string, type: WalletType) {
    return this.walletRepository.findWalletForUpdate(client, accountId, type);
  }

  async updateBalance(client, walletId: string, newBalance: number) {
    return this.walletRepository.updateBalance(client, walletId, newBalance);
  }

  async findWallet(accountId: string, type: WalletType) {
    return this.walletRepository.find({ accountId, type });
  }

  async findWallets(accountId: string) {
    return this.walletRepository.findAccountWallets(accountId);
  }

  async getBalance(accountId: string, type: WalletType) {
    const wallet = await this.findWallet(accountId, type);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet.balance;
  }

  async getBalances(accountId: string) {
    const gcashBalance = await this.getBalance(accountId, WalletType.GCASH);
    const cashBalance = await this.getBalance(accountId, WalletType.CASH);
    return { gcashBalance, cashBalance };
  }
}
