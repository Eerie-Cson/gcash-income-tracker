import { Module } from '@nestjs/common';

import { DatabaseModule } from './libs/database/adapter.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
})
export class AppModule {}
