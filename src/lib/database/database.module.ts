import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PG_POOL',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return new Pool({
          user: config.get<string>('PG_USER'),
          host: config.get<string>('PG_HOST'),
          database: config.get<string>('PG_NAME'),
          password: config.get<string>('PG_PASSWORD'),
          port: config.get<number>('PG_LOCAL_PORT'),
        });
      },
    },
  ],
  exports: ['PG_POOL'],
})
export class DatabaseModule {}
