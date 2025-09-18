import { useAuth } from "@/contexts/AuthContext";
import { useLocalSettings } from "@/hooks/useLocalSettings";
import { nav } from "@/const/NavigationList";
import { useState, useMemo } from "react";
import MobileDrawer from "../mobile/MobileDrawer";
import SettingsPanel from "../settings/SettingsPanel";
import Sidebar, { NavItemId } from "./Sidebar";
import TransactionsList from "./TransactionsList";
import { useWalletBalances } from "@/hooks/useWalletBalance";
import { useGetTransactions } from "@/hooks/useGetTransactions";
import DashboardHeader from "./Header";
import { TrendingUp, Calendar } from "lucide-react";
import { fontMap, accentMap, borderMap } from "@/const/CustomSettings";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import KpiCards from "./KpiCards";
import Stats from "./Stats";
import TotalBalanceSummary from "./TotalBalanceSummary";
import TransactionsTable from "./TransactionsTable";
import TransactionForm from "../transaction/Transaction";

export default function Dashboard() {
	const { logout, account } = useAuth();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [active, setActive] = useState<NavItemId>("dashboard");
	const [collapsed, setCollapsed] = useState(false);

	const { fontSize, setFontSize, compact, setCompact, accent, setAccent } =
		useLocalSettings({
			fontSize: "large",
			compact: false,
			accent: "emerald",
		});

	const { transactions } = useGetTransactions();
	const { balances } = useWalletBalances();

	const totalProfit = useMemo(
		() =>
			transactions.reduce((sum, transaction) => sum + transaction.profit, 0),
		[transactions]
	);

	const totalBalance = useMemo(
		() => balances.cash + balances.gcash,
		[balances.cash, balances.gcash]
	);

	const dashboardStats = useDashboardStats(transactions);

	const fontClass = useMemo(() => {
		return fontMap[fontSize] || fontMap.large;
	}, [fontSize]);

	const accentClass = useMemo(() => {
		return accentMap[accent] || accentMap.emerald;
	}, [accent]);

	const accentBorderClass = useMemo(() => {
		return borderMap[accent] || borderMap.emerald;
	}, [accent]);

	// Event handlers
	const handleAddTransaction = () => {
		// TODO: Implement add transaction modal
		console.log("Add transaction clicked");
	};

	const handleExport = () => {
		// TODO: Implement export functionality
		console.log("Export clicked");
	};

	const handleNotificationClick = () => {
		// TODO: Implement notification panel
		console.log("Notifications clicked");
	};

	return (
		<>
			<div className={`flex h-screen border-r border-blue-300 ${fontClass}`}>
				{/* <Sidebar
					nav={nav}
					active={active}
					setActive={setActive}
					balances={balances}
					totalProfit={totalProfit}
					setSettingsOpen={setSettingsOpen}
					logout={logout}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
				/> */}

				<main
					className={`bg-gradient-to-bl from-teal-100 via-white to-teal-100 flex-1 h-screen overflow-auto px-6 py-8 transition-all duration-200 ${
						collapsed ? "md:pl-4" : "md:pl-6"
					}`}
				>
					{/* Header */}
					<DashboardHeader
						userName={account?.name}
						accentClass={accentClass}
						onAddTransaction={handleAddTransaction}
						onExport={handleExport}
						onNotificationClick={handleNotificationClick}
						notifications={3}
					/>

					{/* Primary KPI Cards */}
					<KpiCards
						balances={balances}
						totalProfit={totalProfit}
						accentClass={accentClass}
						compact={compact}
						accent={accent}
					/>

					{/* Total Balance Summary */}
					<TotalBalanceSummary
						totalBalance={totalBalance}
						accentBorderClass={accentBorderClass}
						accentClass={accentClass}
					/>

					{/* Recent Transactions */}
					<TransactionsTable
						accentClass={accentClass}
						transactions={transactions}
						setActive={setActive}
						compact={compact}
					/>

					{/* Secondary Stats */}
					<Stats
						dashboardStats={dashboardStats}
						compact={compact}
						accentBorderClass={accentBorderClass}
						accentClass={accentClass}
					/>

					<footer className="mt-8 text-sm text-slate-500 text-center">
						Built with Tailwind • Clean UI • Settings available
					</footer>
				</main>
			</div>

			{/* Mobile Drawer */}
			<MobileDrawer
				mobileOpen={mobileOpen}
				nav={nav}
				setActive={setActive}
				setMobileOpen={setMobileOpen}
				setSettingsOpen={setSettingsOpen}
			/>

			{/* Settings Panel */}
			<SettingsPanel
				open={settingsOpen}
				setOpen={setSettingsOpen}
				fontSize={fontSize}
				setFontSize={setFontSize}
				compact={compact}
				setCompact={setCompact}
				accent={accent}
				setAccent={setAccent}
			/>
		</>
	);
}
