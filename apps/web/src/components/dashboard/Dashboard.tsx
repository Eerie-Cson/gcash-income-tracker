"use client";

import React, { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MobileDrawer from "../mobile/MobileDrawer";
import SettingsPanel from "../settings/SettingsPanel";
import TransactionsTable from "./TransactionsTable";
import DashboardHeader from "./Header";
import { fontMap, accentMap, borderMap } from "@/const/CustomSettings";
import KpiCards from "./KpiCards";
import Stats from "./Stats";
import TotalBalanceSummary from "./TotalBalanceSummary";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDashboardUI } from "@/contexts/DashboardUIContext";
import { nav } from "@/const/NavigationList";

/**
 * Dashboard component reads UI state from the DashboardUIContext and data from useDashboardData.
 * This keeps the page presentational and prevents duplicating layout-level state.
 */
export default function Dashboard() {
	const { account, logout } = useAuth();
	const { transactions, balances, dashboardStats, totalProfit, totalBalance } =
		useDashboardData();

	const {
		mobileOpen,
		setMobileOpen,
		settingsOpen,
		setSettingsOpen,
		fontSize,
		setFontSize,
		compact,
		setCompact,
		accent,
		setAccent,
		setActive,
	} = useDashboardUI();

	const fontClass = useMemo(
		() => fontMap[fontSize as keyof typeof fontMap] || fontMap.large,
		[fontSize]
	);
	const accentClass = useMemo(
		() => accentMap[accent as keyof typeof accentMap] || accentMap.emerald,
		[accent]
	);
	const accentBorderClass = useMemo(
		() => borderMap[accent as keyof typeof borderMap] || borderMap.emerald,
		[accent]
	);

	const handleAddTransaction = () => {
		// wire up modal later
		console.log("Add transaction clicked");
	};
	const handleExport = () => {
		console.log("Export clicked");
	};
	const handleNotificationClick = () => {
		console.log("Notifications clicked");
	};

	return (
		<>
			<div
				className={`bg-gradient-to-bl from-teal-100 via-white to-teal-100 flex-1 h-screen overflow-auto px-6 py-8 transition-all duration-200 ${fontClass}`}
			>
				<DashboardHeader
					userName={account?.name}
					accentClass={accentClass}
					onAddTransaction={handleAddTransaction}
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

				<Stats
					dashboardStats={dashboardStats}
					compact={compact}
					accentBorderClass={accentBorderClass}
					accentClass={accentClass}
				/>

				<footer className="mt-8 text-sm text-slate-500 text-center">
					Built with Tailwind • Clean UI • Settings available
				</footer>
			</div>

			{/* Keep mobile drawer & settings here in case layout doesn't render them (redundancy safe) */}
			<MobileDrawer
				mobileOpen={mobileOpen}
				nav={nav}
				setActive={() => {}}
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
