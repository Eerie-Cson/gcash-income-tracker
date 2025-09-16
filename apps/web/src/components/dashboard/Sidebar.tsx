"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
	User,
	Settings,
	LogOut,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

type NavItemId = "dashboard" | "transactions" | "report" | "guide";
interface NavItem {
	id: NavItemId;
	label: string;
	icon: React.ComponentType<any>;
}

interface SidebarProps {
	nav: NavItem[];
	active: NavItemId;
	setActive: Dispatch<SetStateAction<NavItemId>>;
	balances: any;
	totalProfit: number;
	setSettingsOpen: Dispatch<SetStateAction<boolean>>;
	logout: () => void;
	collapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({
	nav,
	active,
	setActive,
	balances,
	totalProfit,
	setSettingsOpen,
	logout,
	collapsed,
	setCollapsed,
}: SidebarProps) {
	const totalBal = balances.cash + balances.gcash;

	return (
		// hidden on small screens, flex on md+. width toggles between collapsed and expanded.
		<aside
			className={`hidden md:flex flex-col shrink-0 px-4 py-6 border-r backdrop-blur-sm transition-all duration-200 ${
				collapsed ? "w-20" : "w-72 px-6"
			}`}
		>
			{/* Header */}
			<div
				className={`mb-6 flex items-center gap-3 ${
					collapsed ? "justify-center" : ""
				}`}
			>
				<div
					className={`${
						collapsed ? "text-lg" : "text-2xl"
					} text-emerald-600 font-extrabold`}
				>
					{/* show short brand when collapsed */}
					{collapsed ? "GC" : "GCash Tracker"}
				</div>
			</div>

			{/* Nav */}
			<nav className="flex flex-col gap-2">
				{nav.map((n) => {
					const Icon = n.icon;
					const selected = active === n.id;
					return (
						<button
							key={n.id}
							onClick={() => setActive(n.id)}
							title={n.label}
							className={`flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-all duration-150 ${
								selected
									? "bg-gradient-to-r from-emerald-50 to-white shadow-sm"
									: "hover:bg-slate-50"
							} ${collapsed ? "justify-center" : "pl-3"}`}
						>
							<Icon
								className={`w-5 h-5 ${
									selected ? "text-emerald-600" : "text-slate-400"
								}`}
							/>
							{!collapsed && (
								<span
									className={`font-medium ${
										selected ? "text-slate-900" : "text-slate-700"
									}`}
								>
									{n.label}
								</span>
							)}
						</button>
					);
				})}
			</nav>

			{/* Balances */}
			{!collapsed && (
				<div className="mt-6">
					<div className="text-xs text-slate-500">Balances</div>
					<div className="mt-3 rounded-xl p-4 bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-sm">
						<div className="text-sm text-emerald-600 font-semibold">{`₱${totalBal.toLocaleString()}`}</div>
						<div className="text-xs text-slate-400 mt-1">Cash + GCash</div>

						<div className="mt-3 text-xs text-slate-500">Total profit</div>
						<div
							className={`mt-1 ${
								totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"
							}`}
						>
							{`₱${totalProfit.toLocaleString()}`}
						</div>
					</div>
				</div>
			)}

			{/* Bottom actions */}
			<div className="mt-auto pt-4 grid gap-2">
				<div className={`${collapsed ? "flex justify-center" : ""}`}>
					<button
						className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 ${
							collapsed ? "w-10 h-10 p-0" : ""
						}`}
						title="Profile"
					>
						<User className="w-4 h-4 text-slate-500" />
						{!collapsed && <span className="text-slate-700">Profile</span>}
					</button>
				</div>

				<button
					onClick={() => setSettingsOpen(true)}
					className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 ${
						collapsed ? "w-10 h-10 p-0" : ""
					}`}
					title="Settings"
				>
					<Settings className="w-4 h-4" />
					{!collapsed && <span className="font-medium">Settings</span>}
				</button>

				<button
					onClick={() => logout()}
					className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors duration-200 ${
						collapsed ? "w-10 h-10 p-0" : ""
					}`}
					title="Sign out"
				>
					<LogOut className="w-4 h-4" />
					{!collapsed && <span>Sign out</span>}
				</button>

				{/* collapse toggle */}
				<div className={`${collapsed ? "flex justify-center mt-2" : "mt-2"}`}>
					<button
						onClick={() => setCollapsed((v) => !v)}
						className="inline-flex items-center justify-center w-full md:w-auto p-2 rounded-md hover:bg-slate-50"
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						title={collapsed ? "Expand" : "Collapse"}
					>
						{collapsed ? (
							<ChevronRight className="w-4 h-4" />
						) : (
							<ChevronLeft className="w-4 h-4" />
						)}
					</button>
				</div>
			</div>
		</aside>
	);
}
