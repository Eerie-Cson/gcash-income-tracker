import { Inject, Injectable } from '@nestjs/common';
import { PgRepository, Repository, Table } from '../../libs/repository';
import { Token } from '../../libs/database/lib/token';
import { ProfitTier } from '../../libs/types/profit';
import { Pool, PoolClient } from 'pg';

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
