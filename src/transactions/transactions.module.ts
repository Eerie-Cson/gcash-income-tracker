import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Token } from './repository/token';
import { TransactionRepository } from './repository/transaction.repository';

@Module({
  controllers: [TransactionsController],
  providers: [
    { provide: Token.TransactionRepository, useClass: TransactionRepository },
    TransactionsService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
