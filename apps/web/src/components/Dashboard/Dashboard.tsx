"use client";
import { useAuth } from "@/contexts/AuthContext";
import {
	ArrowDownCircle,
	ArrowUpCircle,
	BarChart3,
	BookOpen,
	Home,
	ListChecks,
	LogOut,
	Menu,
	Search,
	Settings,
	User,
	X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TransactionType = "cash-in" | "cash-out";
interface Transaction {
	id: string;
	type: TransactionType;
	amount: number;
	profit: number;
	date: Date;
}
interface Balances {
	cash: number;
	gcash: number;
}

export default function RedesignedDashboard() {
	const { logout } = useAuth();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [active, setActive] = useState<
		"dashboard" | "transactions" | "report" | "guide"
	>("dashboard");

	// UI settings
	const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
		"large"
	);
	const [compact, setCompact] = useState(false);
	const [accent, setAccent] = useState<
		"slate" | "torquoise" | "emerald" | "indigo"
	>("emerald");

	// sample data
	const [balances] = useState<Balances>({ cash: 15_450, gcash: 28_750 });
	const [transactions] = useState<Transaction[]>([
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
		// {
		// 	id: "3",
		// 	type: "cash-in",
		// 	amount: 2200,
		// 	profit: 150,
		// 	date: new Date(Date.now() - 1000 * 60 * 60 * 6),
		// },
		// {
		// 	id: "4",
		// 	type: "cash-out",
		// 	amount: 800,
		// 	profit: -30,
		// 	date: new Date(Date.now() - 1000 * 60 * 60 * 26),
		// },
		{
			id: "5",
			type: "cash-in",
			amount: 900,
			profit: 40,
			date: new Date(Date.now() - 1000 * 60 * 60 * 48),
		},
	]);

	const totalProfit = transactions.reduce((s, t) => s + t.profit, 0);

	useEffect(() => {
		// simple preference persistence
		try {
			const raw = localStorage.getItem("rd-dashboard-settings");
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed.fontSize) setFontSize(parsed.fontSize);
				if (typeof parsed.compact === "boolean") setCompact(parsed.compact);
				if (parsed.accent) setAccent(parsed.accent);
			}
		} catch (e) {}
	}, []);

	useEffect(() => {
		localStorage.setItem(
			"rd-dashboard-settings",
			JSON.stringify({ fontSize, compact, accent })
		);
	}, [fontSize, compact, accent]);

	const fmt = (v: number) => `₱${v.toLocaleString()}`;
	const fmtDate = (d: Date) =>
		d.toLocaleString(undefined, { month: "short", day: "numeric" });
	const fmtTime = (d: Date) =>
		d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

	const nav = [
		{ id: "dashboard", label: "Dashboard", icon: Home },
		{ id: "transactions", label: "Transactions", icon: ListChecks },
		{ id: "report", label: "Report", icon: BarChart3 },
		{ id: "guide", label: "Guide", icon: BookOpen },
	] as const;

	const fontClass = useMemo(() => {
		switch (fontSize) {
			case "small":
				return "text-sm";
			case "medium":
				return "text-base";
			default:
				return "text-lg"; // large by default
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
		<div
			className={`h-screen w-screen bg-gradient-to-b from-white to-slate-50 ${fontClass}`}
		>
			{/* Top bar (mobile) */}
			<div className="md:hidden bg-white border-b">
				<div className="flex items-center justify-between px-4 py-3">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setMobileOpen((v) => !v)}
							className="p-2 rounded-md hover:bg-slate-100 focus:outline-none"
						>
							{mobileOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</button>
						<div>
							<div className="font-bold">GCash Tracker</div>
							<div className="text-xs text-slate-500">Personal summary</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<div
							className={`hidden sm:flex items-center gap-2 text-sm font-medium ${accentClass}`}
						>
							{fmt(balances.cash + balances.gcash)}
						</div>
						<button
							onClick={() => setSettingsOpen(true)}
							className="p-2 rounded-md hover:bg-slate-100"
						>
							<Settings className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>

			<div className="flex h-full border-r border-blue-300">
				{/* Sidebar (desktop) */}
				<aside className="hidden md:flex flex-col w-72 shrink-0 px-6 py-8 border-r backdrop-blur-sm">
					<div className="mb-6">
						<div className={`text-2xl ${accentClass} font-extrabold`}>
							GCash Tracker
						</div>
						<div className="text-sm text-slate-500 mt-1">
							Insightful • Calm • Clear
						</div>
					</div>

					<nav className="flex flex-col gap-2 ">
						{nav.map((n) => {
							const Icon = n.icon;
							const selected = active === n.id;
							return (
								<button
									key={n.id}
									onClick={() => setActive(n.id as any)}
									className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 ${
										selected
											? "bg-gradient-to-r from-emerald-50 to-white shadow-sm"
											: "hover:bg-slate-50"
									}`}
								>
									<Icon
										className={`w-5 h-5 ${
											selected ? "text-emerald-600" : "text-slate-400"
										}`}
									/>
									<span
										className={`font-medium ${
											selected ? "text-slate-900" : "text-slate-700"
										}`}
									>
										{n.label}
									</span>
								</button>
							);
						})}
					</nav>

					<div className="mt-6">
						<div className="text-xs text-slate-500">Balances</div>
						<div className="mt-3 rounded-xl p-4 bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-sm">
							<div className="text-sm text-emerald-600 font-semibold">
								{fmt(balances.cash + balances.gcash)}
							</div>
							<div className="text-xs text-slate-400 mt-1">Cash + GCash</div>

							<div className="mt-3 text-xs text-slate-500">Total profit</div>
							<div
								className={`mt-1 ${
									totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"
								}`}
							>
								{fmt(totalProfit)}
							</div>
						</div>
					</div>

					<div className="mt-auto pt-6">
						<div className="grid gap-2">
							<button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
								<User className="w-4 h-4 text-slate-500" />{" "}
								<span className="text-slate-700">Profile</span>
							</button>

							<button
								onClick={() => setSettingsOpen(true)}
								className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100"
							>
								<Settings className="w-4 h-4" />{" "}
								<span className="font-medium">Settings</span>
							</button>

							<button
								onClick={() => logout()}
								className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 
               bg-white text-slate-700 
               hover:bg-rose-50 hover:border-rose-200 
               hover:text-rose-600 transition-colors duration-200"
							>
								<LogOut className="w-4 h-4" />
								<span>Sign out</span>
							</button>
						</div>
					</div>
				</aside>

				{/* Main content (scrollable) */}
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
										<Search className="w-4 h-4 text-slate-400" />
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
							<div className={`text-2xl font-bold ${accentClass}`}>
								{fmt(balances.cash + balances.gcash)}
							</div>
							<div className="flex items-center gap-2 text-sm text-slate-500">
								<div
									className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs`}
								>
									{totalProfit >= 0 ? `+${fmt(totalProfit)}` : fmt(totalProfit)}
								</div>
								<button
									onClick={() => setSettingsOpen(true)}
									className="p-2 rounded-md hover:bg-slate-100"
								>
									<Settings className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>

					{/* Cards grid */}
					<section
						className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 ${
							compact ? "gap-3" : "gap-6"
						}`}
					>
						<Card
							accent={accent}
							accentClass={accentClass}
							title="Cash"
							value={fmt(balances.cash)}
							subtitle="Physical cash on hand"
						>
							<MiniSpark values={[10, 12, 8, 15, 11]} accent={accent} />
						</Card>

						<Card
							accent={accent}
							accentClass={accentClass}
							title="GCash"
							value={fmt(balances.gcash)}
							subtitle="Digital wallet"
						>
							<MiniSpark values={[8, 10, 9, 12, 14]} accent={accent} />
						</Card>

						<Card
							accent={accent}
							accentClass={totalProfit >= 0 ? accentClass : "rose"}
							title="Profit"
							value={fmt(totalProfit)}
							subtitle="Period to date"
						>
							<div
								className={`text-sm ${
									totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"
								} font-semibold mt-1`}
							>
								{" "}
								{totalProfit >= 0 ? "+" : "-"}
								{fmt(Math.abs(totalProfit))}
							</div>
						</Card>
					</section>

					{/* Transactions list with clearer structure */}
					<section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
						<div className="flex items-center justify-between mb-4">
							<h2 className={`text-2xl ${accentClass} font-semibold`}>
								Recent transactions
							</h2>
							<div className="text-sm text-slate-500">
								Showing {Math.min(transactions.length, 10)}
							</div>
						</div>

						<div className="divide-y divide-slate-100">
							{transactions.slice(0, 10).map((t) => {
								const isIn = t.type === "cash-in";
								return (
									<div
										key={t.id}
										className={`py-4 flex items-center justify-between gap-4 ${
											compact ? "py-2" : "py-4"
										}`}
									>
										<div className="flex items-center gap-4 min-w-0">
											<div
												className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
													isIn
														? "bg-emerald-50 border-emerald-100"
														: "bg-rose-50 border-rose-100"
												}`}
											>
												{isIn ? (
													<ArrowDownCircle className="w-6 h-6 text-emerald-600" />
												) : (
													<ArrowUpCircle className="w-6 h-6 text-rose-600" />
												)}
											</div>

											<div className="min-w-0">
												<div className="flex items-center gap-2">
													<div className="font-medium truncate">
														{isIn ? "Cash in" : "Cash out"}
													</div>
													<div className="text-xs text-slate-400">
														• {fmtDate(t.date)} {fmtTime(t.date)}
													</div>
												</div>
												<div className="text-sm text-slate-500 truncate">
													Ref: #{t.id} · sample note (tap to add)
												</div>
											</div>
										</div>

										<div className="text-right">
											<div className="font-semibold">{fmt(t.amount)}</div>
											<div
												className={`text-sm ${
													t.profit >= 0 ? "text-emerald-600" : "text-rose-600"
												}`}
											>
												{t.profit >= 0
													? `+${fmt(t.profit)}`
													: `-${fmt(Math.abs(t.profit))}`}
											</div>
										</div>
									</div>
								);
							})}
						</div>

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

			{/* Mobile drawer overlay */}
			{mobileOpen && (
				<div className="md:hidden fixed inset-0 z-40 bg-black/30">
					<div className="absolute left-0 top-0 w-64 h-full bg-white p-4">
						<div className="flex items-center justify-between mb-6">
							<div>
								<div className="text-sm font-semibold">GCash Tracker</div>
								<div className="text-xs text-slate-500">Menu</div>
							</div>
							<button onClick={() => setMobileOpen(false)} className="p-2">
								<X className="w-5 h-5" />
							</button>
						</div>

						<nav className="flex flex-col gap-2">
							{nav.map((n) => {
								const Icon = n.icon;
								return (
									<button
										key={n.id}
										onClick={() => {
											setActive(n.id as any);
											setMobileOpen(false);
										}}
										className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50"
									>
										<Icon className="w-4 h-4 text-slate-500" />
										<span>{n.label}</span>
									</button>
								);
							})}
						</nav>

						<div className="mt-6">
							<button
								onClick={() => setSettingsOpen(true)}
								className="w-full px-3 py-2 rounded-md border border-slate-200"
							>
								Settings
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Settings slide-over */}
			<div
				className={`fixed right-0 top-0 h-full z-50 transform transition-transform duration-200 ${
					settingsOpen ? "translate-x-0" : "translate-x-full"
				}`}
				style={{ width: 340 }}
			>
				<div className="h-full bg-white border-l shadow-2xl p-6 overflow-auto">
					<div className="flex items-center justify-between mb-4">
						<div>
							<div className="text-lg font-semibold">Settings</div>
							<div className="text-xs text-slate-500">
								Personalize your dashboard
							</div>
						</div>
						<button
							onClick={() => setSettingsOpen(false)}
							className="p-2 rounded-md hover:bg-slate-50"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<div className="text-sm font-medium">Font size</div>
							<div className="mt-2 flex gap-2">
								<button
									onClick={() => setFontSize("small")}
									className={`px-3 py-2 rounded-lg border ${
										fontSize === "small" ? "bg-slate-100" : "bg-white"
									}`}
								>
									Small
								</button>
								<button
									onClick={() => setFontSize("medium")}
									className={`px-3 py-2 rounded-lg border ${
										fontSize === "medium" ? "bg-slate-100" : "bg-white"
									}`}
								>
									Medium
								</button>
								<button
									onClick={() => setFontSize("large")}
									className={`px-3 py-2 rounded-lg border ${
										fontSize === "large" ? "bg-slate-100" : "bg-white"
									}`}
								>
									Large
								</button>
							</div>
						</div>

						<div>
							<div className="text-sm font-medium">Layout density</div>
							<div className="mt-2 flex items-center gap-3">
								<label className="inline-flex items-center gap-2">
									<input
										type="checkbox"
										checked={compact}
										onChange={(e) => setCompact(e.target.checked)}
									/>
									<span className="text-sm text-slate-600">Compact rows</span>
								</label>
							</div>
						</div>

						<div>
							<div className="text-sm font-medium">Accent color</div>
							<div className="mt-2 flex items-center gap-2">
								<button
									onClick={() => setAccent("torquoise")}
									className={`w-8 h-8 rounded-full ${
										accent === "torquoise" ? "ring-2 ring-[#ade7fb]" : "ring-0"
									}`}
									style={{
										background: "linear-gradient(180deg,#c7effc,#ade7fb)",
									}}
								/>
								<button
									onClick={() => setAccent("emerald")}
									className={`w-8 h-8 rounded-full ${
										accent === "emerald" ? "ring-2 ring-emerald-200" : "ring-0"
									}`}
									style={{
										background: "linear-gradient(180deg,#ECFDF5,#D1FAE5)",
									}}
								/>
								<button
									onClick={() => setAccent("indigo")}
									className={`w-8 h-8 rounded-full ${
										accent === "indigo" ? "ring-2 ring-indigo-200" : "ring-0"
									}`}
									style={{
										background: "linear-gradient(180deg,#EEF2FF,#E0E7FF)",
									}}
								/>
								<button
									onClick={() => setAccent("slate")}
									className={`w-8 h-8 rounded-full ${
										accent === "slate" ? "ring-2 ring-slate-200" : "ring-0"
									}`}
									style={{
										background: "linear-gradient(180deg,#F8FAFC,#F1F5F9)",
									}}
								/>
							</div>
						</div>

						<div className="pt-4 border-t">
							<div className="text-sm text-slate-500">
								Preferences are saved locally in your browser.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/* --------- Helper components (inline) ---------- */

function Card({ title, value, subtitle, children, accentClass }: any) {
	return (
		<div
			className={`bg-teal-50  rounded-2xl p-5 shadow-sm border border-l-5 border-slate-100 border-l-emerald-400`}
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="text-sm text-slate-500">{title}</div>
					<div className={`mt-2 text-2xl font-bold ${accentClass}`}>
						{value}
					</div>
					<div className="text-xs text-slate-400 mt-1">{subtitle}</div>
				</div>
				<div className="w-24 h-12 flex items-center justify-end">
					{children}
				</div>
			</div>
		</div>
	);
}

function MiniSpark({ values, accent = "emerald" }: any) {
	const max = Math.max(...values);
	const points = values
		.map(
			(v: number, i: number) =>
				`${(i / (values.length - 1)) * 100},${100 - (v / max) * 100}`
		)
		.join(" ");
	const stroke = "#10b981";
	// accent ===
	// "indigo"
	// 	? "#6366f1"
	// 	: accent === "slate"
	// 	? "#64748b"
	// :
	return (
		<svg
			viewBox="0 0 100 100"
			className="w-full h-10"
			preserveAspectRatio="none"
		>
			<polyline
				fill="none"
				strokeWidth={2}
				stroke={stroke}
				points={points}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
