import { Inject, Injectable } from '@nestjs/common';
import { snakeCase } from 'change-case';
import { Pool, PoolClient } from 'pg';
import { Token } from '../../libs/database/lib/token';
import { PgRepository, Repository, Table } from '../../libs/repository';
import { Transaction } from '../../libs/types';

@Injectable()
export class TransactionRepository
  extends PgRepository<Transaction>
  implements Repository<Transaction>
{
  constructor(@Inject(Token.PG_POOL) protected readonly pool: Pool) {
    super(pool, Table.TRANSACTION);
  }

  async createTransaction(
    client: PoolClient,
    data: Partial<Transaction> & {
      createdAt: Date;
      updatedAt: Date;
      accountId: string;
      transactionCode: string;
    },
  ) {
    const columns = Object.keys(data).map((k) => snakeCase(k));
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${this.getTable()} (${columns.join(', ')}) VALUES (${placeholders})`;
    await client.query(query, values);
  }
}
