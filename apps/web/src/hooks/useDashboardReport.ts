import {
	DashboardStats,
	getDashboardStats,
	getProfitSummary,
} from "@/api/report";
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

export function useDashboardStats() {
	const defaultStats: DashboardStats = {
		todayCount: 0,
		weeklyAverage: 0,
		largestTransaction: 0,
		todayProfit: 0,
	};

	const { token } = useAuth();
	const [stats, setStats] = useState<DashboardStats>(defaultStats);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchStats = useCallback(async () => {
		if (!token) return;

		try {
			setLoading(true);
			setError(null);
			const statsData = await getDashboardStats();
			setStats(statsData);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to fetch stats"));
			setStats(defaultStats);
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return {
		stats,
		loading,
		error,
		refetch: fetchStats,
	};
}
