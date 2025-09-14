import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PgRepository, Repository, Table } from 'src/libs/repository';
import { Token } from '../../libs/database/lib/token';
import { Account } from '../../libs/types';

@Injectable()
export class AccountRepository
  extends PgRepository<Account>
  implements Repository<Account>
{
  constructor(@Inject(Token.PG_POOL) protected readonly pool: Pool) {
    super(pool, Table.ACCOUNT);
  }

  async findSeedAccount(): Promise<Account> {
    return this.find({
      id: '7cf43eef-5759-4659-8d9a-d66c711b9705',
    });
  }
}
