import { useAuth } from "@/contexts/AuthContext";
import { useLocalSettings } from "@/hooks/useLocalSettings";
import Card from "@/ui/Card";
import MiniSpark from "@/ui/Minispark";
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

export default function Dashboard() {
	const { logout } = useAuth();
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

	// Computed values
	const totalProfit = useMemo(
		() =>
			transactions.reduce((sum, transaction) => sum + transaction.profit, 0),
		[transactions]
	);

	const totalBalance = useMemo(
		() => balances.cash + balances.gcash,
		[balances.cash, balances.gcash]
	);

	// Calculate dashboard stats
	const dashboardStats = useMemo(() => {
		const today = new Date();
		const todayTransactions = transactions.filter((t) => {
			const transactionDate = new Date(t.transactionDate);
			return transactionDate.toDateString() === today.toDateString();
		});

		const last7Days = transactions.filter((t) => {
			const transactionDate = new Date(t.transactionDate);
			const daysDiff = 10;
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

	// Styling helpers
	const fontClass = useMemo(() => {
		return fontMap[fontSize] || fontMap.large;
	}, [fontSize]);

	const accentClass = useMemo(() => {
		const accentMap = {
			indigo: "text-indigo-600",
			slate: "text-slate-700",
			torquoise: "text-[#14a4d4]",
			emerald: "text-emerald-600",
		};
		return accentMap[accent] || accentMap.emerald;
	}, [accent]);

	const accentBorderClass = useMemo(() => {
		const borderMap = {
			indigo: "border-indigo-200",
			slate: "border-slate-200",
			torquoise: "border-[#14a4d4]/20",
			emerald: "border-emerald-200",
		};
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
				<Sidebar
					nav={nav}
					active={active}
					setActive={setActive}
					balances={balances}
					totalProfit={totalProfit}
					setSettingsOpen={setSettingsOpen}
					logout={logout}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
				/>

				<main
					className={`bg-gradient-to-bl from-teal-100 via-white to-teal-100 flex-1 h-screen overflow-auto px-6 py-8 transition-all duration-200 ${
						collapsed ? "md:pl-4" : "md:pl-6"
					}`}
				>
					{/* Header */}
					<DashboardHeader
						userName="John Doe"
						accentClass={accentClass}
						onAddTransaction={handleAddTransaction}
						onExport={handleExport}
						onNotificationClick={handleNotificationClick}
						notifications={3}
					/>

					{/* Primary KPI Cards */}
					<section
						className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
							compact ? "gap-3" : "gap-6"
						} mb-6`}
					>
						<Card
							accentClass={accentClass}
							title="Cash"
							value={`₱${balances.cash.toLocaleString()}`}
							subtitle="Physical cash on hand"
						>
							<MiniSpark values={[10, 12, 8, 15, 11]} accent={accent} />
						</Card>
						<Card
							accentClass={accentClass}
							title="GCash"
							value={`₱${balances.gcash.toLocaleString()}`}
							subtitle="Digital wallet"
						>
							<MiniSpark values={[8, 10, 9, 12, 14]} accent={accent} />
						</Card>
						<Card
							accentClass={totalProfit >= 0 ? accentClass : "text-rose-600"}
							title="Profit"
							value={`₱${totalProfit.toLocaleString()}`}
							subtitle="Period to date"
						>
							<div
								className={`text-sm ${
									totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"
								} font-semibold mt-1`}
							>
								{totalProfit >= 0 ? "+" : ""}₱
								{Math.abs(totalProfit).toLocaleString()}
							</div>
						</Card>
					</section>

					{/* Secondary Stats */}
					<section
						className={`grid grid-cols-2 sm:grid-cols-4 ${
							compact ? "gap-3" : "gap-4"
						} mb-6`}
					>
						<div
							className={`bg-white p-4 rounded-lg border ${accentBorderClass} shadow-sm hover:shadow-md transition-shadow`}
						>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-slate-600">
									Today's Transactions
								</span>
								<div className="w-2 h-2 rounded-full bg-blue-500"></div>
							</div>
							<div className="text-xl font-semibold text-slate-800">
								{dashboardStats.todayCount}
							</div>
							<div className="text-xs text-slate-500">transactions today</div>
						</div>

						<div
							className={`bg-white p-4 rounded-lg border ${accentBorderClass} shadow-sm hover:shadow-md transition-shadow`}
						>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-slate-600">Weekly Average</span>
								<div className="w-2 h-2 rounded-full bg-purple-500"></div>
							</div>
							<div className="text-xl font-semibold text-slate-800">
								₱{dashboardStats.weeklyAverage.toLocaleString()}
							</div>
							<div className="text-xs text-slate-500">per day</div>
						</div>

						<div
							className={`bg-white p-4 rounded-lg border ${accentBorderClass} shadow-sm hover:shadow-md transition-shadow`}
						>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-slate-600">
									Largest Transaction
								</span>
								<div className="w-2 h-2 rounded-full bg-orange-500"></div>
							</div>
							<div className="text-xl font-semibold text-slate-800">
								₱{dashboardStats.largestTransaction.toLocaleString()}
							</div>
							<div className="text-xs text-slate-500">this period</div>
						</div>

						<div
							className={`bg-white p-4 rounded-lg border ${accentBorderClass} shadow-sm hover:shadow-md transition-shadow`}
						>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-slate-600">
									Monthly Commission
								</span>
								<div
									className={`w-2 h-2 rounded-full ${accentClass.replace(
										"text-",
										"bg-"
									)}`}
								></div>
							</div>
							<div className="text-xl font-semibold text-slate-800">
								₱{dashboardStats.monthlyCommission.toLocaleString()}
							</div>
							<div
								className={`text-xs ${
									dashboardStats.monthlyCommission >= 0
										? "text-emerald-600"
										: "text-rose-600"
								}`}
							>
								this month
							</div>
						</div>
					</section>

					{/* Total Balance Summary */}
					<section
						className={`bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 shadow-sm border ${accentBorderClass} mb-6`}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<div
										className={`w-2 h-2 rounded-full ${accentClass.replace(
											"text-",
											"bg-"
										)}`}
									></div>
									<span className="text-sm text-slate-600 font-medium">
										Total Balance
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-2xl font-bold text-slate-800">
										₱{totalBalance.toLocaleString()}
									</span>
									<div className="flex items-center gap-1 text-emerald-600 text-sm">
										<TrendingUp className="w-4 h-4" />
										<span>+5.2%</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-6 text-sm text-slate-500">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-blue-500"></div>
									<span>Last updated 2 minutes ago</span>
								</div>
								<div className="hidden lg:flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									<span>This month</span>
								</div>
							</div>
						</div>
					</section>

					{/* Recent Transactions */}
					<section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
						<div className="flex items-center justify-between mb-4">
							<h2 className={`text-2xl ${accentClass} font-semibold`}>
								Recent transactions
							</h2>
							<div className="text-sm text-slate-500">
								Showing {Math.min(transactions.length, 5)} out of{" "}
								{transactions.length}
							</div>
						</div>

						<TransactionsList
							transactions={transactions.slice(0, 5)}
							compact={compact}
						/>

						<div className="mt-4 flex justify-end">
							<button
								onClick={() => setActive("transactions")}
								className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
							>
								View all
							</button>
						</div>
					</section>

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
