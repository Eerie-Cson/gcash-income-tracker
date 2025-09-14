import { Inject, Injectable } from '@nestjs/common';
import {
  CreateTransactionRequest,
  TransactionType,
  WalletType,
} from '../libs/types';
import { Token as WalletToken } from '../wallet/repository/token';
import { WalletRepository } from '../wallet/repository/wallet.repository';
import { Token as TranasctionToken } from './repository/token';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionsController } from './transactions.controller';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(TranasctionToken.TransactionRepository)
    private readonly transactionsRepository: TransactionRepository,
    @Inject(WalletToken.WalletRepository)
    private walletRepository: WalletRepository,
  ) {}

  generateTransactionCode(date: number): string {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampPart = date.toString(36).toUpperCase();
    return `TXN-${randomPart}-${timestampPart}`;
  }

  async create(params: Parameters<TransactionsController['create']>[0]) {
    const now = Date.now();

    return this.transactionsRepository.create({
      data: {
        description: params.description || undefined,
        amount: params.amount || 0,
        type: params.type,
        referenceNumber: params.referenceNumber || undefined,
        transactionDate: params.transactionDate || undefined,
        transactionCode: this.generateTransactionCode(now),
        createdAt: new Date(now),
        updatedAt: new Date(now),
      },
    });
  }

  async cashIn(params: CreateTransactionRequest) {
    const accountId = '7cf43eef-5759-4659-8d9a-d66c711b9705';

    return this.transactionsRepository.executeTransactions(async (client) => {
      const cashWallet = await this.walletRepository.findWalletForUpdate(
        client,
        accountId,
        WalletType.CASH,
      );

      const gcashWallet = await this.walletRepository.findWalletForUpdate(
        client,
        accountId,
        WalletType.GCASH,
      );

      if (!cashWallet || !gcashWallet) {
        throw new Error('Wallet not found');
      }

      if (gcashWallet.balance < params.amount) {
        throw new Error('Insufficient balance in GCash wallet');
      }

      const newGcashBalance = Number(gcashWallet.balance) - params.amount;

      const newCashBalance = Number(cashWallet.balance) + params.amount;

      await this.walletRepository.updateBalance(
        client,
        cashWallet.id,
        newCashBalance,
      );

      await this.walletRepository.updateBalance(
        client,
        gcashWallet.id,
        newGcashBalance,
      );

      await this.transactionsRepository.insertTransaction(client, {
        description: params.description || undefined,
        amount: params.amount || 0,
        type: TransactionType.CASH_IN,
        referenceNumber: params.referenceNumber || undefined,
        transactionDate: params.transactionDate || undefined,
        transactionCode: this.generateTransactionCode(Date.now()),
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId,
      });
    });
  }
}
