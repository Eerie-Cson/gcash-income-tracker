import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { WalletModule } from '../wallet/wallet.module';
import { Token as TransactionToken } from './repository/token';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [AccountModule, WalletModule],
  controllers: [TransactionsController],
  providers: [
    {
      provide: TransactionToken.TransactionRepository,
      useClass: TransactionRepository,
    },

    TransactionsService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
