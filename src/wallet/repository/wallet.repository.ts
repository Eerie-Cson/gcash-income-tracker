import { Inject } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { Token } from '../../libs/database/lib/token';
import { PgRepository, Repository, Table } from '../../libs/repository';
import { Wallet, WalletType } from '../../libs/types/wallet';

export class WalletRepository
  extends PgRepository<Wallet>
  implements Repository<Wallet>
{
  constructor(@Inject(Token.PG_POOL) protected readonly pool: Pool) {
    super(pool, Table.WALLET);
  }

  async findWalletForUpdate(
    client: PoolClient,
    accountId: string,
    type: WalletType,
  ) {
    const res = await client.query(
      `SELECT id, balance FROM "Wallet" WHERE account_id = $1 AND type = $2 FOR UPDATE`,
      [accountId, type],
    );
    return res.rows[0];
  }

  async updateBalance(
    client: PoolClient,
    walletId: string,
    newBalance: number,
  ) {
    await client.query(
      `UPDATE "Wallet" SET balance = $1, updated_at = $2  WHERE id = $3`,
      [newBalance, new Date(), walletId],
    );
  }
}
