import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { Token } from '../../libs/database/lib/token';
import { PgRepository, Repository, Table } from '../../libs/repository';
import { ProfitTier } from '../../libs/types/profit';

@Injectable()
export class ProfitRepository
  extends PgRepository<ProfitTier>
  implements Repository<ProfitTier>
{
  constructor(@Inject(Token.PG_POOL) protected readonly pool: Pool) {
    super(pool, Table.PROFIT);
  }

  async createProfitTier(client: PoolClient, data: Partial<ProfitTier>) {
    const feeTier = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.create({ data: feeTier }, client);
  }
}
