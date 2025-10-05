"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useDashboardUI } from "@/contexts/DashboardUIContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
	useDashboardStats,
	useProfitSummary,
} from "@/hooks/useDashboardReport";
import { useTransactionsApi } from "@/hooks/useTransactionsApi";
import { accentMap, borderMap } from "@/utils/types";
import { useMemo } from "react";
import DashboardHeader from "./Header";
import KpiCards from "./KpiCards";
import Stats from "./Stats";
import TotalBalanceSummary from "./TotalBalanceSummary";
import TransactionsTable from "./TransactionsTable";

export default function Dashboard() {
	const { account } = useAuth();
	const { balances, totalBalance } = useDashboardData();
	const { transactions } = useTransactionsApi();
	const { stats: dashboardStats } = useDashboardStats();
	const { totalProfit } = useProfitSummary();
	const { compact, accent, setActive } = useDashboardUI();

	const accentClass = useMemo(
		() => accentMap[accent as keyof typeof accentMap] || accentMap.emerald,
		[accent]
	);
	const accentBorderClass = useMemo(
		() => borderMap[accent as keyof typeof borderMap] || borderMap.emerald,
		[accent]
	);

	const handleExport = () => {
		console.log("Export clicked");
	};
	const handleNotificationClick = () => {
		console.log("Notifications clicked");
	};

	return (
		<div className="p-4 md:p-6">
			<div className="space-y-6">
				<DashboardHeader
					userName={account?.name}
					accentClass={accentClass}
					onExport={handleExport}
					onNotificationClick={handleNotificationClick}
					notifications={3}
				/>

				<KpiCards
					balances={balances}
					totalProfit={totalProfit}
					accentClass={accentClass}
					compact={compact}
					accent={accent}
				/>

				<TotalBalanceSummary
					totalBalance={totalBalance}
					accentBorderClass={accentBorderClass}
					accentClass={accentClass}
				/>

				<TransactionsTable
					setActive={setActive}
					accentClass={accentClass}
					transactions={transactions}
					compact={compact}
				/>

				<Stats dashboardStats={dashboardStats} />

				<footer className="mt-8 text-sm text-slate-500 text-center">
					Built with Tailwind • Clean UI • Settings available
				</footer>
			</div>
		</div>
	);
}
