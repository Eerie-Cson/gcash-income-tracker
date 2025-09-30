"use client";
import { NavItem, NavItemId } from "@/utils/types";
import { WallterType } from "@/utils/types/wallet";
import {
	ChevronLeft,
	ChevronRight,
	Copy,
	LogOut,
	Settings,
	TrendingDown,
	TrendingUp,
	User,
	Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface SidebarProps {
	nav: NavItem[];
	active: NavItemId;
	setActive: (id: NavItemId) => void;
	balances: Record<WallterType, number>;
	totalProfit: number;
	setSettingsOpen: (v: boolean) => void;
	logout: () => void;
	collapsed: boolean;
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
	nav,
	active,
	setActive,
	balances = { cash: 0, gcash: 0 } as Record<WallterType, number>,
	totalProfit = 0,
	setSettingsOpen,
	logout,
	collapsed,
	setCollapsed,
}: SidebarProps) {
	const totalBal = (balances?.cash || 0) + (balances?.gcash || 0);
	const router = useRouter();

	return (
		<aside
			className={`hidden md:flex flex-col shrink-0 transition-all duration-200 bg-slate-800 border-r backdrop-blur-sm ${
				collapsed ? "w-20 px-2 py-4" : "w-72 px-6 py-6"
			}`}
		>
			<div className="flex flex-col flex-1 overflow-y-auto justify-between">
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
						{collapsed ? "GC" : "GCash Tracker"}
					</div>
				</div>

				<nav className="flex flex-col gap-2">
					{nav.map((n) => {
						const Icon = n.icon;
						const selected = active === n.id;
						return (
							<button
								key={n.id}
								onClick={() => {
									setActive(n.id);
									router.push(`${n.id}`);
									// if (n.id === "transactions") router.push("/transactions");
									// else if (n.id === "dashboard") router.push("/dashboard");
									// else if (n.id === NavigationType.Configurations)
									// 	router.push("/configurations");
									// else router.push(`/dashboard/${n.id}`);
								}}
								title={n.label}
								className={`cursor-pointer group flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-all duration-150 ${
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

				{!collapsed && (
					<div className="mt-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm overflow-hidden">
						<div className="px-5 pt-5 pb-3">
							<div className="flex items-center gap-2 mb-1">
								<div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
									<Wallet className="w-4 h-4 text-emerald-600" />
								</div>
								<span className="text-sm font-medium text-slate-700">
									Total Balance
								</span>
							</div>

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

						<div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-blue-500" />
									<span className="text-sm text-slate-600">GCash</span>
								</div>
								<span className="text-sm font-medium text-slate-900">
									₱{(balances?.gcash || 0).toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-emerald-500" />
									<span className="text-sm text-slate-600">Cash</span>
								</div>
								<span className="text-sm font-medium text-slate-900">
									₱{(balances?.cash || 0).toLocaleString()}
								</span>
							</div>
						</div>
					</div>
				)}

				<div className="mt-auto pt-4 grid gap-2">
					<div className={`${collapsed ? "flex justify-center" : ""}`}>
						<button
							className={`cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-emerald-700 border border-slate-200 bg-emerald-50 hover:bg-slate-50 ${
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
						className={`cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 ${
							collapsed ? "w-10 h-10 p-0" : ""
						}`}
						title="Settings"
					>
						<Settings className="w-4 h-4" />
						{!collapsed && <span className="font-medium">Settings</span>}
					</button>

					<button
						onClick={() => logout()}
						className={`cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors duration-200 ${
							collapsed ? "w-10 h-10 p-0" : ""
						}`}
						title="Sign out"
					>
						<LogOut className="w-4 h-4" />
						{!collapsed && <span>Sign out</span>}
					</button>

					<div className={`${collapsed ? "flex justify-center mt-2" : "mt-2"}`}>
						<button
							onClick={() => setCollapsed((v: boolean) => !v)}
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
