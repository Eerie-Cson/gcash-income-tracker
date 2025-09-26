import { camelCase, snakeCase } from 'change-case';
import { Pool, PoolClient } from 'pg';
import { Table } from './const/tables';
import { Repository, QueryOptions, PaginationResult } from './type';

export abstract class PgRepository<T> implements Repository<T> {
  constructor(
    protected readonly pool: Pool,
    private readonly table: Table,
  ) {}

  getTable(): Table {
    return this.table;
  }

  private serializeData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[snakeCase(key)] = value;
    }
    return serialized;
  }

  private deserializeData(row: any): T {
    if (!row) return row;

    return Object.fromEntries(
      Object.entries(row).map(([key, value]) => [camelCase(key), value]),
    ) as T;
  }

  private buildWhereClause(filter?: Partial<Record<keyof T, any>>): {
    clause: string;
    values: any[];
  } {
    if (!filter || Object.keys(filter).length === 0) {
      return { clause: '', values: [] };
    }

    const conditions: string[] = [];
    const values: any[] = [];

    Object.entries(filter).forEach(([key, value], index) => {
      if (value === undefined || value === null) return;

      const columnName = snakeCase(key as string);
      conditions.push(`${columnName} = $${index + 1}`);
      values.push(value);
    });

    return {
      clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
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
      query += ` ORDER BY ${snakeCase(orderBy.column as string)} ${orderBy.direction ?? 'ASC'}`;
    }

    const result = await this.pool.query(query, values);
    return result.rows.map((row) => this.deserializeData(row));
  }

  async paginate(
    filter?: Partial<Record<keyof T, any>>,
    options: QueryOptions = {},
    search?: {
      term: string;
      fields: (keyof T)[];
    },
  ): Promise<PaginationResult<T>> {
    let { clause, values } = this.buildWhereClause(filter);
    let countClause = clause;
    let countValues = [...values];

    // Add search conditions if provided
    if (search && search.term) {
      const searchConditions = search.fields.map((field, index) => {
        return `${snakeCase(field as string)} ILIKE $${values.length + index + 1}`;
      });

      const searchClause = `(${searchConditions.join(' OR ')})`;

      if (clause) {
        clause = `${clause} AND ${searchClause}`;
        countClause = `${countClause} AND ${searchClause}`;
      } else {
        clause = `WHERE ${searchClause}`;
        countClause = `WHERE ${searchClause}`;
      }

      values = [...values, ...search.fields.map(() => `%${search.term}%`)];
      countValues = [
        ...countValues,
        ...search.fields.map(() => `%${search.term}%`),
      ];
    }

    let query = `SELECT * FROM ${this.table} ${clause}`;
    let countQuery = `SELECT COUNT(*) as total FROM ${this.table} ${countClause}`;

    if (options.orderBy) {
      query += ` ORDER BY ${snakeCase(options.orderBy.column as string)} ${options.orderBy.direction ?? 'ASC'}`;
    }

    let paginationValues = [...values];
    if (options.pagination) {
      const { page, limit } = options.pagination;
      const offset = (page - 1) * limit;
      query += ` LIMIT $${paginationValues.length + 1} OFFSET $${paginationValues.length + 2}`;
      paginationValues.push(limit, offset);
    }

    const [result, countResult] = await Promise.all([
      this.pool.query(query, paginationValues),
      this.pool.query(countQuery, countValues),
    ]);

    const total = parseInt(countResult.rows[0]?.total || '0');
    const totalPages = options.pagination
      ? Math.ceil(total / options.pagination.limit)
      : 1;
    const currentPage = options.pagination?.page || 1;

    return {
      data: result.rows.map((row) => this.deserializeData(row)),
      total,
      page: currentPage,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  }

  async find(
    filter: Partial<Record<keyof T, any>>,
    orderBy?: { column: keyof T; direction?: 'ASC' | 'DESC' },
  ): Promise<T | null> {
    const { clause, values } = this.buildWhereClause(filter);

    let query = `SELECT * FROM ${this.table} ${clause}`;
    if (orderBy) {
      query += ` ORDER BY ${snakeCase(orderBy.column as string)} ${orderBy.direction ?? 'ASC'}`;
    }
    query += ' LIMIT 1';

    const result = await this.pool.query(query, values);
    return result.rows[0] ? this.deserializeData(result.rows[0]) : null;
  }

  async delete(filter: Partial<Record<keyof T, any>>): Promise<boolean> {
    const { clause, values } = this.buildWhereClause(filter);

    if (!clause) {
      throw new Error('Delete operation requires a filter');
    }

    const result = await this.pool.query(
      `DELETE FROM ${this.table} ${clause}`,
      values,
    );
    return result.rowCount > 0;
  }

  async create(params: {
    data: Partial<T> & { createdAt: Date; updatedAt: Date };
  }): Promise<T> {
    const serializedData = this.serializeData(params.data);
    const columns = Object.keys(serializedData);
    const values = columns.map((key) => serializedData[key]);

    const fields = columns.join(', ');
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${this.table} (${fields}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.pool.query(query, values);

    return this.deserializeData(result.rows[0]);
  }

  async update(
    filter: Partial<Record<keyof T, any>>,
    data: Partial<T>,
  ): Promise<T | null> {
    const serializedData = this.serializeData(data);
    const { clause: whereClause, values: whereValues } =
      this.buildWhereClause(filter);

    if (!whereClause) {
      throw new Error('Update operation requires a filter');
    }

    const setClause = Object.keys(serializedData)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = [...Object.values(serializedData), ...whereValues];

    const query = `UPDATE ${this.table} SET ${setClause} ${whereClause} RETURNING *`;
    const result = await this.pool.query(query, values);

    return result.rows[0] ? this.deserializeData(result.rows[0]) : null;
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
