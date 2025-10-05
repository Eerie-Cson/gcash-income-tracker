"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useDashboardUI } from "@/contexts/DashboardUIContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
	useDashboardStats,
	useProfitSummary,
} from "@/hooks/useDashboardReport";
import { useTransactions } from "@/contexts/TransactionsContext";
import DashboardHeader from "./Header";
import KpiCards from "./KpiCards";
import Stats from "./Stats";
import TotalBalanceSummary from "./TotalBalanceSummary";
import TransactionsTable from "./TransactionsTable";

export default function Dashboard() {
	const { account } = useAuth();
	const { balances, totalBalance } = useDashboardData();
	const { transactions } = useTransactions();
	const { stats: dashboardStats } = useDashboardStats();
	const { totalProfit } = useProfitSummary();
	const { setActive } = useDashboardUI();

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
					onExport={handleExport}
					onNotificationClick={handleNotificationClick}
					notifications={3}
				/>

				<KpiCards balances={balances} totalProfit={totalProfit} />

				<TotalBalanceSummary totalBalance={totalBalance} />

				<TransactionsTable setActive={setActive} transactions={transactions} />

				<Stats dashboardStats={dashboardStats} />

				<footer className="mt-8 text-sm text-slate-500 text-center">
					Built with Tailwind • Clean UI • Settings available
				</footer>
			</div>
		</div>
	);
}
