import { useMemo } from "react";
import { useWalletBalances } from "@/hooks/useWalletBalance";

export function useDashboardData() {
	const { balances = { cash: 0, gcash: 0 }, refetch } = useWalletBalances();

	const totalBalance = useMemo(
		() => (balances?.cash || 0) + (balances?.gcash || 0),
		[balances]
	);

	return {
		balances,
		totalBalance,
		refetchBalances: refetch,
	};
}
