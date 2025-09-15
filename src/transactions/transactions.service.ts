import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTransactionRequest,
  TransactionType,
  WalletType,
} from '../libs/types';
import { Token as WalletToken } from '../wallet/repository/token';
import { WalletRepository } from '../wallet/repository/wallet.repository';
import { Token as TranasctionToken } from './repository/token';
import { TransactionRepository } from './repository/transaction.repository';

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

  async transfer(
    params: CreateTransactionRequest & {
      from: WalletType;
      to: WalletType;
      amount: number;
      transactionType: TransactionType;
      accountId: string;
    },
  ) {
    return this.transactionsRepository.executeTransactions(async (client) => {
      const fromWallet = await this.walletRepository.findWalletForUpdate(
        client,
        params.accountId,
        params.from,
      );

      const toWallet = await this.walletRepository.findWalletForUpdate(
        client,
        params.accountId,
        params.to,
      );

      if (!fromWallet || !toWallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (fromWallet.balance < params.amount) {
        throw new BadRequestException(
          `Insufficient balance in ${params.from} wallet`,
        );
      }

      const newFromBalance = Number(fromWallet.balance) - params.amount;
      const newToBalance = Number(toWallet.balance) + params.amount;

      await this.walletRepository.updateBalance(
        client,
        fromWallet.id,
        newFromBalance,
      );

      await this.walletRepository.updateBalance(
        client,
        toWallet.id,
        newToBalance,
      );

      await this.transactionsRepository.createTransaction(client, {
        description: params.description || undefined,
        amount: params.amount || 0,
        type: TransactionType.CASH_IN,
        referenceNumber: params.referenceNumber || undefined,
        transactionDate: params.transactionDate || undefined,
        transactionCode: this.generateTransactionCode(Date.now()),
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: params.accountId,
      });

      return { [params.from]: newFromBalance, [params.to]: newToBalance };
    });
  }

  async cashIn(params: CreateTransactionRequest) {
    const accountId = '7cf43eef-5759-4659-8d9a-d66c711b9705';
    return this.transfer({
      ...params,
      from: WalletType.GCASH,
      to: WalletType.CASH,
      transactionType: TransactionType.CASH_IN,
      accountId,
    });
  }

  async cashOut(params: CreateTransactionRequest) {
    const accountId = '7cf43eef-5759-4659-8d9a-d66c711b9705';
    return this.transfer({
      ...params,
      from: WalletType.CASH,
      to: WalletType.GCASH,
      transactionType: TransactionType.CASH_OUT,
      accountId,
    });
  }
}
