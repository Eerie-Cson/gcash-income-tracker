"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/dashboard/Sidebar";
// import MobileDrawer from "@/components/mobile/MobileDrawer";
// import SettingsPanel from "@/components/settings/SettingsPanel";
import { nav } from "@/const/NavigationList";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { fontMap, NavigationType } from "@/utils/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import {
	DashboardUIProvider,
	useDashboardUI,
} from "../../contexts/DashboardUIContext";
import { useProfitSummary } from "@/hooks/useDashboardReport";

function InnerLayout({ children }: { children: React.ReactNode }) {
	const { balances } = useDashboardData();
	const { logout } = useAuth();

	const {
		// mobileOpen,
		// setMobileOpen,
		// settingsOpen,
		setSettingsOpen,
		active,
		setActive,
		collapsed,
		setCollapsed,
		fontSize,
		// setFontSize,
		// compact,
		// setCompact,
		// accent,
		// setAccent,
	} = useDashboardUI();

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

	const { totalProfit, loading: profitLoading } = useProfitSummary();
	if (profitLoading) {
		return <div>Loading profit data...</div>;
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
					collapsed={collapsed}
					setCollapsed={setCollapsed}
				/>

				<main
					className={`flex-1 min-h-screen overflow-auto transition-all duration-200 bg-gradient-to-bl from-teal-100 via-white to-teal-100 ${
						collapsed ? "md:pl-4" : "md:pl-6"
					}`}
				>
					{children}
				</main>
			</div>

			{/* <MobileDrawer
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
			/> */}
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
