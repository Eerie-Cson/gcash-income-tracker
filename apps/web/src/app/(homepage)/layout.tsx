"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/dashboard/Sidebar";
import { nav } from "@/const/NavigationList";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProfitSummary } from "@/hooks/useDashboardReport";
import Spinner from "@/ui/Spinner";
import { fontMap, NavigationType } from "@/utils/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import {
	DashboardUIProvider,
	useDashboardUI,
} from "../../contexts/DashboardUIContext";

function InnerLayout({ children }: { children: React.ReactNode }) {
	const { balances } = useDashboardData();
	const { logout } = useAuth();

	const { setSettingsOpen, active, setActive, fontSize } = useDashboardUI();

	const fontClass = useMemo(
		() => fontMap[fontSize as keyof typeof fontMap] || fontMap.large,
		[fontSize]
	);

	const pathname = usePathname();
	useEffect(() => {
		if (!pathname) return;
		if (pathname.startsWith("/transactions"))
			setActive(NavigationType.Transactions);
		else if (pathname === "/dashboard" || pathname === "/dashboard/")
			setActive(NavigationType.Dashboard);
		else if (pathname.startsWith("/dashboard/report"))
			setActive(NavigationType.Report);
		else if (pathname.startsWith("/configurations"))
			setActive(NavigationType.Configurations);
	}, [pathname, setActive]);

	const { totalProfit, loading: isLoading } = useProfitSummary();
	if (isLoading) {
		return <Spinner></Spinner>;
	}

	return (
		<ProtectedRoute>
			<div className={`flex h-screen ${fontClass}`}>
				<Sidebar
					nav={nav}
					active={active}
					setActive={setActive}
					balances={balances}
					totalProfit={totalProfit}
					setSettingsOpen={setSettingsOpen}
					logout={logout}
				/>

				<main className="flex-1 min-h-screen overflow-auto bg-gradient-to-bl from-teal-100 via-white to-teal-100 md:pl-6">
					{children}
				</main>
			</div>
		</ProtectedRoute>
	);
}

export default function DashboardLayout(props: { children: React.ReactNode }) {
	return (
		<DashboardUIProvider>
			<InnerLayout {...props} />
		</DashboardUIProvider>
	);
}
