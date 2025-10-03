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

export type DashboardStats = {
  todayCount: number;
  weeklyAverage: number;
  largestTransaction: number;
  todaysProfit: number;
  totalTransactions: number;
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

  async getDashboardStats(accountId: string): Promise<DashboardStats> {
    const query = `
      WITH stats AS (
        SELECT 
          COUNT(CASE 
            WHEN DATE(created_at) = CURRENT_DATE 
            THEN 1 
          END) as today_count,
          
          COALESCE(AVG(CASE 
            WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' 
            THEN ABS(amount) 
          END), 0) as weekly_average,
          
          COALESCE(MAX(ABS(amount)), 0) as largest_transaction,
          
          COALESCE(SUM(CASE 
            WHEN DATE(created_at) = CURRENT_DATE
            THEN profit 
          END), 0) as today_profit,
          
          COUNT(*) as total_transactions
          
        FROM "Transaction" 
        WHERE account_id = $1
      )
      SELECT 
        today_count,
        ROUND(weekly_average) as weekly_average,
        largest_transaction,
        today_profit,
        total_transactions
      FROM stats
    `;

    const result = await this.pool.query(query, [accountId]);
    const row = result.rows[0];

    return {
      todayCount: Number(row.today_count),
      weeklyAverage: Number(row.weekly_average),
      largestTransaction: Number(row.largest_transaction),
      todaysProfit: Number(row.today_profit),
      totalTransactions: Number(row.total_transactions),
    };
  }
}
