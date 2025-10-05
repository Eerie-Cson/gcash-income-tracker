"use client";
import { NavItem, NavItemId } from "@/utils/types";
import { X } from "lucide-react";
import React from "react";

export default function MobileDrawer({
	mobileOpen,
	nav,
	setActive,
	setMobileOpen,
}: {
	mobileOpen: boolean;
	nav: NavItem[];
	setActive: (id: NavItemId) => void;
	setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	if (!mobileOpen) return null;
	return (
		<div className="md:hidden fixed inset-0 z-40 bg-black/30">
			<div className="absolute left-0 top-0 w-64 h-full bg-white p-4">
				<div className="flex items-center justify-between mb-6">
					<div>
						<div className="text-sm font-semibold">GCash Tracker</div>
						<div className="text-xs text-slate-500">Menu</div>
					</div>
					<button onClick={() => setMobileOpen(false)} className="p-2">
						<X className="w-5 h-5" />
					</button>
				</div>

				<nav className="flex flex-col gap-2">
					{nav.map((n: NavItem) => {
						const Icon = n.icon;
						return (
							<button
								key={n.id}
								onClick={() => {
									setActive(n.id as NavItemId);
									setMobileOpen(false);
								}}
								className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50"
							>
								<Icon className="w-4 h-4 text-slate-500" />
								<span>{n.label}</span>
							</button>
						);
					})}
				</nav>
			</div>
		</div>
	);
}
