// app/(dashboard)/layout.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar, { NavItemId } from "@/components/dashboard/Sidebar";
import MobileDrawer from "@/components/mobile/MobileDrawer";
import SettingsPanel from "@/components/settings/SettingsPanel";
import { nav } from "@/const/NavigationList";
import { useWalletBalances } from "@/hooks/useWalletBalance";
import { useGetTransactions } from "@/hooks/useGetTransactions";
import { useAuth } from "@/contexts/AuthContext";
import { fontMap } from "@/const/CustomSettings";
import { useLocalSettings } from "@/hooks/useLocalSettings";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [active, setActive] = useState<NavItemId>("dashboard");
	const [collapsed, setCollapsed] = useState(false);

	const { transactions } = useGetTransactions();
	const { balances } = useWalletBalances();
	const { logout } = useAuth();

	const { fontSize } = useLocalSettings({
		fontSize: "large",
		compact: false,
		accent: "emerald",
	});

	const totalProfit = useMemo(
		() => transactions.reduce((s, t) => s + (t.profit || 0), 0),
		[transactions]
	);

	const fontClass = useMemo(
		() => fontMap[fontSize] || fontMap.large,
		[fontSize]
	);

	// sync active nav from pathname so button highlight works when you navigate via URL
	const pathname = usePathname();
	useEffect(() => {
		if (!pathname) return;
		if (pathname.startsWith("/transactions")) setActive("transactions");
		else if (pathname === "/dashboard" || pathname === "/dashboard/")
			setActive("dashboard");
		else if (pathname.startsWith("/dashboard/report")) setActive("report");
		else if (pathname.startsWith("/dashboard/guide")) setActive("guide");
	}, [pathname]);

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

			<MobileDrawer
				mobileOpen={mobileOpen}
				nav={nav}
				setActive={(id: NavItemId) => setActive(id)}
				setMobileOpen={setMobileOpen}
				setSettingsOpen={setSettingsOpen}
			/>

			<SettingsPanel
				open={settingsOpen}
				setOpen={setSettingsOpen}
				fontSize={fontSize}
				setFontSize={() => {}}
				compact={false}
				setCompact={() => {}}
				accent="emerald"
				setAccent={() => {}}
			/>
		</ProtectedRoute>
	);
}
