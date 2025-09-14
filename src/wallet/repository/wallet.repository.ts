import { Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { Token } from '../../libs/database/lib/token';
import { PgRepository, Repository, Table } from '../../libs/repository';
import { Wallet } from '../../libs/types/wallet';

export class WalletRepository
  extends PgRepository<Wallet>
  implements Repository<Wallet>
{
  constructor(@Inject(Token.PG_POOL) protected readonly pool: Pool) {
    super(pool, Table.WALLET);
  }
}
