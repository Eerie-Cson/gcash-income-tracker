import { snakeCase } from 'change-case';
import { Pool, PoolClient } from 'pg';
import { Table } from './const/tables';
import { Repository } from './type';

export abstract class PgRepository<T> implements Repository<T> {
  constructor(
    protected readonly pool: Pool,
    private readonly table: Table,
  ) {}

  getTable(): Table {
    return this.table;
  }

  async fetch(): Promise<T[]> {
    const result = await this.pool.query(`SELECT * FROM ${this.table}`);
    return result.rows;
  }

  async find(filter: { id: string }): Promise<T> {
    const result = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [filter.id],
    );
    return result.rows[0];
  }

  async delete(filter: { id: string }): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM ${this.table} WHERE id = $1`,
      [filter.id],
    );
    return result.rowCount > 0;
  }

  async create(params: {
    data: Partial<T> & { createdAt: Date; updatedAt: Date };
  }): Promise<boolean> {
    const columns = Object.keys(params.data);

    const data = columns.map((key) => {
      return params.data[key] ? params.data[key] : null;
    });

    const fields = columns.map((key) => snakeCase(key)).join(', ');

    const values = columns.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${this.getTable()} (
        ${fields}
      ) VALUES (
        ${values}
      )`;

    const result = await this.pool.query(query, data);

    return result.rowCount > 0;
  }

  async executeTransactions<R>(
    fn: (client: PoolClient) => Promise<R>,
  ): Promise<R> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
