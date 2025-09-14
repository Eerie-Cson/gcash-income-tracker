import { Module } from '@nestjs/common';
import { Token as WalletToken } from '../wallet/repository/token';
import { WalletRepository } from '../wallet/repository/wallet.repository';
import { Token as TransactionToken } from './repository/token';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    {
      provide: TransactionToken.TransactionRepository,
      useClass: TransactionRepository,
    },
    { provide: WalletToken.WalletRepository, useClass: WalletRepository },

    TransactionsService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
