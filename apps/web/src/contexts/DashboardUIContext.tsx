"use client";

import { NavigationType, NavItemId } from "@/utils/types";
import React, {
	createContext,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface DashboardUI {
	mobileOpen: boolean;
	setMobileOpen: SetState<boolean>;
	active: NavItemId;
	setActive: SetState<NavItemId>;
}

const DashboardUIContext = createContext<DashboardUI | undefined>(undefined);

export function DashboardUIProvider({ children }: { children: ReactNode }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [active, setActive] = useState<NavItemId>(NavigationType.Dashboard);

	const value = useMemo(
		() => ({
			mobileOpen,
			setMobileOpen,
			active,
			setActive,
		}),
		[mobileOpen, active]
	);

	return (
		<DashboardUIContext.Provider value={value}>
			{children}
		</DashboardUIContext.Provider>
	);
}

export function useDashboardUI() {
	const ctx = useContext(DashboardUIContext);
	if (!ctx)
		throw new Error("useDashboardUI must be used inside DashboardUIProvider");
	return ctx;
}
