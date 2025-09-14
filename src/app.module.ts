import { Module } from '@nestjs/common';

import { DatabaseModule } from './libs/database/adapter.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, TransactionsModule],
})
export class AppModule {}
