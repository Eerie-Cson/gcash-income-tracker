"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useDashboardUI } from "@/contexts/DashboardUIContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { accentMap, borderMap, fontMap, TransactionType } from "@/utils/types";
import { useMemo, useState } from "react";
import DashboardHeader from "./Header";
import KpiCards from "./KpiCards";
import Stats from "./Stats";
import TotalBalanceSummary from "./TotalBalanceSummary";
import TransactionsTable from "./TransactionsTable";
import AddTransactionModal from "../transaction/AddTransactionModal";
import { useAddTransaction } from "@/hooks/useAddTransaction";
import { useTransactionsApi } from "@/hooks/useTransactionsApi";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Dashboard() {
	const { account } = useAuth();
	const { balances, totalBalance } = useDashboardData();
	const { creating, createTransaction, transactions } = useTransactionsApi();
	const dashboardStats = useDashboardStats(transactions);
	const { isOpen, openModal, closeModal } = useAddTransaction();

	const { fontSize, compact, accent, setActive } = useDashboardUI();

	const fontClass = useMemo(
		() => fontMap[fontSize] || fontMap.large,
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

	const handleSubmit = async (data: any) => {
		try {
			await createTransaction(data);
			closeModal();
			// Do something specific to this component
		} catch (error) {
			// Handle error specifically for this component
		}
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
					onAddTransaction={openModal}
					onExport={handleExport}
					onNotificationClick={handleNotificationClick}
					notifications={3}
				/>

				<KpiCards
					balances={balances}
					totalProfit={0}
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

			<AddTransactionModal
				isOpen={isOpen}
				onClose={closeModal}
				onSubmit={handleSubmit}
				isCreating={creating}
			/>

			{/* <MobileDrawer
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
			/> */}
		</>
	);
}
