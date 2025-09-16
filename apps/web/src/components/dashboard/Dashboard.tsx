import { useAuth } from "@/contexts/AuthContext";
import { useLocalSettings } from "@/hooks/useLocalSettings";
import Card from "@/ui/Card";
import MiniSpark from "@/ui/Minispark";
import { nav } from "@/const/NavigationList";
import { useState, useMemo } from "react";
import MobileDrawer from "../mobile/MobileDrawer";
import SettingsPanel from "../settings/SettingsPanel";
import Sidebar from "./Sidebar";
import TransactionsList from "./TransactionsList";
import { useWalletBalances } from "@/hooks/useWalletBalance";

export default function Dashboard() {
	const { logout } = useAuth();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [active, setActive] = useState<
		"dashboard" | "transactions" | "report" | "guide"
	>("dashboard");

	const { fontSize, setFontSize, compact, setCompact, accent, setAccent } =
		useLocalSettings({ fontSize: "large", compact: false, accent: "emerald" });

	// const [balances] = useState({ cash: 15_450, gcash: 28_750 });
	const { balances } = useWalletBalances();
	const [transactions] = useState([
		{
			id: "1",
			type: "cash-out",
			amount: 1200,
			profit: -50,
			date: new Date(Date.now() - 1000 * 60 * 15),
		},
		{
			id: "2",
			type: "cash-in",
			amount: 600,
			profit: 20,
			date: new Date(Date.now() - 1000 * 60 * 60 * 2),
		},
		{
			id: "5",
			type: "cash-in",
			amount: 900,
			profit: 40,
			date: new Date(Date.now() - 1000 * 60 * 60 * 48),
		},
	]);

	const totalProfit = transactions.reduce((s, t) => s + t.profit, 0);

	const [collapsed, setCollapsed] = useState<boolean>(false);

	const fontClass = useMemo(() => {
		switch (fontSize) {
			case "small":
				return "text-sm";
			case "medium":
				return "text-base";
			default:
				return "text-lg";
		}
	}, [fontSize]);

	const accentClass = useMemo(() => {
		switch (accent) {
			case "indigo":
				return "text-indigo-600";
			case "slate":
				return "text-slate-700";
			case "torquoise":
				return "text-[#14a4d4]";
			default:
				return "text-emerald-600";
		}
	}, [accent]);

	return (
		<>
			<div className={`flex h-full border-r border-blue-300 ${fontClass}`}>
				<Sidebar
					nav={nav as any}
					active={active}
					setActive={setActive}
					balances={balances}
					totalProfit={totalProfit}
					setSettingsOpen={setSettingsOpen}
					logout={logout}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
				/>

				<main className="bg-gradient-to-bl from-teal-100 via-white to-teal-100 flex-1 h-full overflow-auto px-6 py-8">
					{/* Header */}
					<div className="flex items-start justify-between gap-6 mb-6">
						<div>
							<h1
								className={`text-3xl ${accentClass} font-extrabold leading-tight`}
							>
								Overview
							</h1>
							<p className="mt-2 text-slate-600 max-w-xl">
								A compact dashboard with clearer hierarchy, larger type, and
								subtle color to bring life without noise.
							</p>
							<div className="mt-4 flex items-center gap-3">
								<div className="relative">
									<input
										aria-label="Search"
										placeholder="Search transactions, amounts or notes..."
										className="w-full md:w-96 rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-100"
									/>
									<div className="absolute right-2 top-1/2 -translate-y-1/2">
										<svg className="w-4 h-4 text-slate-400" />
									</div>
								</div>
								<button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow-sm">
									New transaction
								</button>
								<button className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
									Import
								</button>
							</div>
						</div>

						<div className="hidden sm:flex flex-col items-end gap-2">
							<div className="text-sm text-slate-500 ">Total balance</div>
							<div className={`text-2xl font-bold ${accentClass}`}>{`₱${(
								balances.cash + balances.gcash
							).toLocaleString()}`}</div>
							<div className="flex items-center gap-2 text-sm text-slate-500">
								<div
									className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs`}
								>
									{totalProfit >= 0
										? `+₱${totalProfit.toLocaleString()}`
										: `₱${totalProfit.toLocaleString()}`}
								</div>
								<button
									onClick={() => setSettingsOpen(true)}
									className="p-2 rounded-md hover:bg-slate-100"
								>
									{/* settings icon placeholder */}
								</button>
							</div>
						</div>
					</div>

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
								{totalProfit >= 0 ? "+" : "-"}
								{`₱${Math.abs(totalProfit).toLocaleString()}`}
							</div>
						</Card>
					</section>

					<section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
						<div className="flex items-center justify-between mb-4">
							<h2 className={`text-2xl ${accentClass} font-semibold`}>
								Recent transactions
							</h2>
							<div className="text-sm text-slate-500">
								Showing {Math.min(transactions.length, 10)}
							</div>
						</div>

						<TransactionsList transactions={transactions} compact={compact} />

						<div className="mt-4 flex justify-end">
							<button className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
								View all
							</button>
						</div>
					</section>

					<footer className="mt-8 text-sm text-slate-500">
						Built with Tailwind • Clean UI • Settings available
					</footer>
				</main>
			</div>
			<MobileDrawer
				mobileOpen={mobileOpen}
				nav={nav}
				setActive={setActive}
				setMobileOpen={setMobileOpen}
				setSettingsOpen={setSettingsOpen}
			/>
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
