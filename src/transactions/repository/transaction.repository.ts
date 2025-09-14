import { Transaction } from '../../libs/types/transaction';
import { Repository } from '../../libs/repository/type';
import { PgRepository } from 'src/libs/repository/pg-repository';
import { Table } from '../../libs/repository/const/tables';
import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Token } from '../../libs/database/lib/token';
import { snakeCase } from 'change-case';

@Injectable()
export class TransactionRepository
  extends PgRepository<Transaction>
  implements Repository<Transaction>
{
  constructor(@Inject(Token.PG_POOL) protected readonly pool: Pool) {
    super(pool, Table.TRANSACTIONS);
  }

  async create(params: {
    data: Partial<Transaction> & { createdAt: Date; updatedAt: Date };
  }): Promise<boolean> {
    const columns = Object.keys(params.data);

    const data = columns.map((key) => {
      return params.data[key] ? params.data[key] : null;
    });

    const fields = columns.map((key) => snakeCase(key)).join(', ');

    const query = `INSERT INTO ${this.getTable()} (
      ${fields}
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8
    )`;

    const result = await this.pool.query(query, data);

    return result.rowCount > 0;
  }
}
