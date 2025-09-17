import { camelCase, snakeCase } from 'change-case';
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

  private buildWhereClause(filter?: Partial<Record<keyof T, any>>): {
    clause: string;
    values: any[];
  } {
    if (!filter || Object.keys(filter).length === 0) {
      return { clause: '', values: [] };
    }

    const keys = Object.keys(filter);
    const values = Object.values(filter);
    const conditions = keys
      .map((key, index) => `${snakeCase(key)} = $${index + 1}`)
      .join(' AND ');

    return {
      clause: `WHERE ${conditions}`,
      values,
    };
  }

  async fetch(
    filter?: Partial<Record<keyof T, any>>,
    orderBy?: { column: keyof T; direction?: 'ASC' | 'DESC' },
  ): Promise<T[]> {
    const { clause, values } = this.buildWhereClause(filter);

    let query = `SELECT * FROM ${this.table} ${clause}`;
    if (orderBy) {
      query += ` ORDER BY ${snakeCase(orderBy.column as string)} ${orderBy.direction ?? 'ASC'};`;
    }

    const result = await this.pool.query(query, values);

    return result.rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [camelCase(key), value]),
      ),
    );
  }
  async find(
    filter: Partial<Record<keyof T, any>>,
    orderBy?: { column: keyof T; direction?: 'ASC' | 'DESC' },
  ): Promise<T | null> {
    const { clause, values } = this.buildWhereClause(filter);

    let query = `SELECT * FROM ${this.table} ${clause} LIMIT 1`;
    if (orderBy) {
      query += ` ORDER BY ${snakeCase(orderBy.column as string)} ${orderBy.direction ?? 'ASC'};`;
    }
    const result = await this.pool.query(query, values);

    return result.rows[0] || null;
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
  }): Promise<T> {
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
      ) RETURNING *`;

    const result = await this.pool.query(query, data);

    return result.rows[0];
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
