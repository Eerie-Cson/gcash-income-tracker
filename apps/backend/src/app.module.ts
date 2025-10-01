import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './libs/database/adapter.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletModule } from './wallet/wallet.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { ProfitModule } from './profit/profit.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TransactionsModule,
    WalletModule,
    AccountModule,
    AuthModule,
    ProfitModule,
    ReportModule,
  ],
})
export class AppModule {}
