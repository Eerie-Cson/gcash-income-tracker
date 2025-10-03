import { getWalletBalances } from "@/api/wallet";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useState, useMemo } from "react";

type Balances = { cash: number; gcash: number };

export function useDashboardData() {
	const { token } = useAuth();
	const [balances, setBalances] = useState<Balances>({ cash: 0, gcash: 0 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchBalances = useCallback(async () => {
		if (!token) return;

		try {
			setLoading(true);
			setError(null);

			const wallet = await getWalletBalances();

			setBalances({
				cash: Number(wallet.cashBalance),
				gcash: Number(wallet.gcashBalance),
			});
		} catch (err: any) {
			setError(err instanceof Error ? err : new Error(String(err)));
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchBalances();
	}, [fetchBalances]);

	useEffect(() => {
		const handleRefreshEvent = () => {
			fetchBalances();
		};

		window.addEventListener("balancesShouldRefresh", handleRefreshEvent);

		return () => {
			window.removeEventListener("balancesShouldRefresh", handleRefreshEvent);
		};
	}, [fetchBalances]);

	const refetch = useCallback(() => {
		return fetchBalances();
	}, [fetchBalances]);

	const totalBalance = useMemo(
		() => (balances.cash || 0) + (balances.gcash || 0),
		[balances]
	);

	return {
		balances,
		totalBalance,
		refetchBalances: refetch,
		loading,
		error,
	};
}
