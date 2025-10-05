"use client";
import { NavItem, NavItemId } from "@/utils/types";
import { WallterType } from "@/utils/types/wallet";
import {
	Copy,
	LogOut,
	Settings,
	TrendingDown,
	TrendingUp,
	User,
	Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
	nav: NavItem[];
	active: NavItemId;
	setActive: (id: NavItemId) => void;
	balances: Record<WallterType, number>;
	totalProfit: number;
	logout: () => void;
}

export default function Sidebar({
	nav,
	active,
	setActive,
	balances = { cash: 0, gcash: 0 } as Record<WallterType, number>,
	totalProfit = 0,
	logout,
}: SidebarProps) {
	const totalBal = (balances?.cash || 0) + (balances?.gcash || 0);
	const router = useRouter();

	return (
		<aside className="hidden md:flex flex-col shrink-0 w-72 px-6 py-6 transition-all duration-200 bg-slate-900 border-r border-slate-700">
			<div className="flex flex-col flex-1 overflow-y-auto justify-between">
				<div className="mb-6 flex items-center gap-3">
					<div className="text-2xl text-emerald-500 font-extrabold">
						GCash Tracker
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
								}}
								title={n.label}
								className={`cursor-pointer group flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-all duration-150 pl-3 ${
									selected ? "bg-emerald-600 shadow-sm" : "hover:bg-slate-800"
								}`}
							>
								<Icon
									className={`w-5 h-5 ${
										selected ? "text-white" : "text-slate-400"
									}`}
								/>
								<span
									className={`font-medium ${
										selected
											? "text-white"
											: "text-slate-400 group-hover:text-slate-200"
									}`}
								>
									{n.label}
								</span>
							</button>
						);
					})}
				</nav>

				<div className="mt-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm overflow-hidden">
					<div className="px-5 pt-5 pb-3">
						<div className="flex items-center gap-2 mb-1">
							<div className="w-8 h-8 rounded-xl bg-emerald-900/50 flex items-center justify-center">
								<Wallet className="w-4 h-4 text-emerald-400" />
							</div>
							<span className="text-sm font-medium text-slate-300">
								Total Balance
							</span>
						</div>

						<div className="mt-3 flex items-baseline gap-3">
							<span className="text-3xl font-bold text-white">
								₱{totalBal.toLocaleString()}
							</span>
							<button
								className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
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
									? "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
									: "bg-red-900/50 text-red-400 border border-red-800"
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

					<div className="border-t border-slate-700 px-5 py-4 bg-slate-900/50">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-blue-500" />
								<span className="text-sm text-slate-400">GCash</span>
							</div>
							<span className="text-sm font-medium text-white">
								₱{(balances?.gcash || 0).toLocaleString()}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-emerald-500" />
								<span className="text-sm text-slate-400">Cash</span>
							</div>
							<span className="text-sm font-medium text-white">
								₱{(balances?.cash || 0).toLocaleString()}
							</span>
						</div>
					</div>
				</div>

				<div className="mt-auto pt-4 grid gap-2">
					<button
						className="cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-300 border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
						title="Profile"
					>
						<User className="w-4 h-4" />
						<span>Profile</span>
					</button>

					<button
						className="cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
						title="Settings"
					>
						<Settings className="w-4 h-4" />
						<span className="font-medium">Settings</span>
					</button>

					<button
						onClick={() => logout()}
						className="cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-red-900/50 hover:border-red-800 hover:text-red-400 transition-colors duration-200"
						title="Sign out"
					>
						<LogOut className="w-4 h-4" />
						<span>Sign out</span>
					</button>
				</div>
			</div>
		</aside>
	);
}
