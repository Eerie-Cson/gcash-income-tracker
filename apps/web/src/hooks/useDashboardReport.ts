import { getProfitSummary } from "@/api/report";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";

export function useProfitSummary() {
	const { token } = useAuth();
	const [summary, setSummary] = useState<{ totalProfit: number } | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchSummary = useCallback(async () => {
		if (!token) return;

		try {
			setLoading(true);
			const data = await getProfitSummary();
			setSummary(data);
		} catch (err) {
			console.error("Failed to fetch profit summary:", err);
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchSummary();
	}, [fetchSummary]);

	return {
		totalProfit: summary?.totalProfit || 0,
		loading,
		refetch: fetchSummary,
	};
}
