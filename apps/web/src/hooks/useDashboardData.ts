// hooks/useDashboardData.ts
import { useMemo } from "react";
import { useTransaction } from "@/hooks/useTransactions";
import { useWalletBalances } from "@/hooks/useWalletBalance";
import { useDashboardStats } from "@/hooks/useDashboardStats";

/**
 * Consolidates data used across the dashboard: transactions, balances, and derived metrics.
 * Keeps pages/components lean and consistent.
 */
export function useDashboardData() {
	const { transactions = [] } = useTransaction();
	const { balances = { cash: 0, gcash: 0 } } = useWalletBalances();

	const totalProfit = useMemo(
		() => transactions.reduce((sum, t) => sum + (t?.profit || 0), 0),
		[transactions]
	);

	const totalBalance = useMemo(
		() => (balances?.cash || 0) + (balances?.gcash || 0),
		[balances]
	);

	const dashboardStats = useDashboardStats(transactions);

	return {
		transactions,
		balances,
		totalProfit,
		totalBalance,
		dashboardStats,
	};
}
