import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { Token } from './lib/token';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Token.PG_POOL,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const connection =
          config.get<string>('DATABASE_URL') ||
          'postgres://admin:root@localhost:5432/test_db';
        return new Pool({
          connectionString: connection,
          max: 5,
          ssl:
            config.get<string>('ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
        });
      },
    },
  ],
  exports: [Token.PG_POOL],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(Token.PG_POOL) private readonly pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}
