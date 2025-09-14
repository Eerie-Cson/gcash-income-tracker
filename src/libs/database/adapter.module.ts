import { Module, Global, OnModuleDestroy, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token } from './lib/token';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Token.PG_POOL,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const connection = config.get<string>('DATABASE_URL');
        return new Pool({
          connectionString: connection,
          max: 5,
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
