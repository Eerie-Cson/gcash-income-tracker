"use client";
import React from "react";
import { Menu, X, Settings, Search } from "lucide-react";

export default function Topbar({
	mobileOpen,
	setMobileOpen,
	balances,
	setSettingsOpen,
}: {
	mobileOpen: boolean;
	setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
	balances: any;
	setSettingsOpen: (v: boolean) => void;
}) {
	return (
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
						className={`hidden sm:flex items-center gap-2 text-sm font-medium text-emerald-600`}
					>
						{`₱${(balances.cash + balances.gcash).toLocaleString()}`}
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
	);
}
