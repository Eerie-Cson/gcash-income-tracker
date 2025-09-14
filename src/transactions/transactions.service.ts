import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from './repository/transaction.repository';
import { Token } from './repository/token';
import { TransactionsController } from './transactions.controller';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(Token.TransactionRepository)
    private readonly transactionsRepository: TransactionRepository,
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
}
