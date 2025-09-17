import { useMemo } from "react";
import { Transaction } from "@/utils/types";

export function useDashboardStats(transactions: Transaction[]) {
	return useMemo(() => {
		const today = new Date();
		const todayTransactions = transactions.filter((t) => {
			const transactionDate = new Date(t.transactionDate);
			return transactionDate.toDateString() === today.toDateString();
		});

		const last7Days = transactions.filter((t) => {
			const transactionDate = new Date(t.transactionDate);
			const daysDiff =
				(today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
			return daysDiff <= 7;
		});

		const weeklyAverage =
			last7Days.length > 0
				? Math.round(
						last7Days.reduce((sum, t) => sum + Math.abs(t.amount), 0) / 7
				  )
				: 0;

		const largestTransaction =
			transactions.length > 0
				? Math.max(...transactions.map((t) => Math.abs(t.amount)))
				: 0;

		const thisMonthProfit = transactions
			.filter((t) => {
				const transactionDate = new Date(t.transactionDate);
				return (
					transactionDate.getMonth() === today.getMonth() &&
					transactionDate.getFullYear() === today.getFullYear()
				);
			})
			.reduce((sum, t) => sum + t.profit, 0);

		return {
			todayCount: todayTransactions.length,
			weeklyAverage,
			largestTransaction,
			monthlyCommission: thisMonthProfit,
		};
	}, [transactions]);
}
