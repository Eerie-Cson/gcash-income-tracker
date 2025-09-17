"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
	User,
	Settings,
	LogOut,
	ChevronLeft,
	ChevronRight,
	Copy,
	TrendingDown,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { WallterType } from "@/utils/types/wallet";

export type NavItemId = "dashboard" | "transactions" | "report" | "guide";
export interface NavItem {
	id: NavItemId;
	label: string;
	icon: React.ComponentType<any>;
}

interface SidebarProps {
	nav: NavItem[];
	active: NavItemId;
	setActive: Dispatch<SetStateAction<NavItemId>>;
	balances: Record<WallterType, number>;
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
		<aside
			className={`hidden bg-black md:flex flex-col shrink-0 transition-all duration-200 bg border-r backdrop-blur-sm ${
				collapsed ? "w-20 px-2 py-4" : "w-72 px-6 py-6"
			}`}
			style={{ minHeight: "100vh" }}
		>
			<div className="flex flex-col h-full overflow-y-auto">
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
								className={`group flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-all duration-150 ${
									selected
										? "bg-gradient-to-r from-emerald-100 to-white shadow-sm"
										: "hover:bg-emerald-50"
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
											selected
												? "text-slate-900"
												: "text-slate-400 group-hover:text-slate-900"
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
					<>
						<div className="mt-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm overflow-hidden">
							{/* Header with better visual hierarchy */}
							<div className="px-5 pt-5 pb-3">
								<div className="flex items-center gap-2 mb-1">
									<div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
										<Wallet className="w-4 h-4 text-emerald-600" />
									</div>
									<span className="text-sm font-medium text-slate-700">
										Total Balance
									</span>
								</div>

								{/* Main balance - hero element */}
								<div className="mt-3 flex items-baseline gap-3">
									<span className="text-3xl font-bold text-slate-900">
										₱{totalBal.toLocaleString()}
									</span>
									<button
										className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
										title="Copy balance"
									>
										<Copy className="w-4 h-4 text-slate-400" />
									</button>
								</div>
							</div>

							{/* Profit indicator - ALWAYS shows, more prominent design */}
							<div className="px-5 pb-3">
								<div
									className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
										totalProfit >= 0
											? "bg-emerald-50 text-emerald-700 border border-emerald-100"
											: "bg-red-50 text-red-700 border border-red-100"
									}`}
								>
									{totalProfit >= 0 ? (
										<TrendingUp className="w-3.5 h-3.5" />
									) : (
										<TrendingDown className="w-3.5 h-3.5" />
									)}
									<span>
										{totalProfit >= 0 ? "+" : ""}₱{totalProfit.toLocaleString()}
									</span>
									<span className="text-xs opacity-75">profit</span>
								</div>
							</div>

							{/* Breakdown - cleaner separation */}
							<div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 rounded-full bg-blue-500"></div>
										<span className="text-sm text-slate-600">Cash</span>
									</div>
									<span className="text-sm font-medium text-slate-900">
										₱{balances.cash.toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 rounded-full bg-emerald-500"></div>
										<span className="text-sm text-slate-600">GCash</span>
									</div>
									<span className="text-sm font-medium text-slate-900">
										₱{balances.gcash.toLocaleString()}
									</span>
								</div>
							</div>
						</div>
					</>
				)}

				{/* Bottom actions */}
				<div className="mt-auto pt-4 grid gap-2">
					<div className={`${collapsed ? "flex justify-center" : ""}`}>
						<button
							className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-emerald-700 border border-slate-200 bg-emerald-50 hover:bg-slate-50 ${
								collapsed ? "w-10 h-10 p-0" : ""
							}`}
							title="Profile"
						>
							<User className="w-4 h-4 text-slate-500" />
							{!collapsed && <span className="text-emerald-700">Profile</span>}
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
			</div>
		</aside>
	);
}
