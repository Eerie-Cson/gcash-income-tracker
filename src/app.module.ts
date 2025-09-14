import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './libs/database/adapter.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletModule } from './wallet/wallet.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TransactionsModule,
    WalletModule,
    AccountModule,
  ],
})
export class AppModule {}
