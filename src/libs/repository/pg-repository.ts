import { Pool } from 'pg';
import { Repository } from './type';
import { Table } from './const/tables';

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

  abstract create(input: Partial<T>): Promise<boolean>;
}
