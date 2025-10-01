// src/report/repository/report.repository.ts
import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Token } from '../../libs/database/lib/token';

export type ProfitSummary = {
  totalProfit: number;
  cashInTotal: number;
  cashOutTotal: number;
  transactionCount: number;
  averageProfitPerTransaction: number;
  totalVolume: number;
};

export type DailyProfit = {
  date: string;
  profit: number;
  transactionCount: number;
};

@Injectable()
export class ReportRepository {
  constructor(@Inject(Token.PG_POOL) protected readonly pool: Pool) {}

  async getProfitSummary(accountId: string): Promise<ProfitSummary> {
    const query = `
      SELECT 
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_volume,
        COALESCE(SUM(profit), 0) as total_profit,
        COALESCE(AVG(profit), 0) as avg_profit_per_txn,
        COALESCE(SUM(CASE WHEN transaction_type = 'Cash-in' THEN profit ELSE 0 END), 0) as cash_in_profit,
        COALESCE(SUM(CASE WHEN transaction_type = 'Cash-out' THEN profit ELSE 0 END), 0) as cash_out_profit
      FROM "Transaction" 
      WHERE account_id = $1 
    `;

    const result = await this.pool.query(query, [accountId]);
    const row = result.rows[0];

    return {
      totalProfit: Number(row.total_profit),
      cashInTotal: Number(row.cash_in_profit),
      cashOutTotal: Number(row.cash_out_profit),
      transactionCount: Number(row.transaction_count),
      averageProfitPerTransaction: Number(row.avg_profit_per_txn),
      totalVolume: Number(row.total_volume),
    };
  }
}
