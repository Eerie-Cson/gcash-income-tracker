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
	active: NavItemId;
	setActive: SetState<NavItemId>;
}

const DashboardUIContext = createContext<DashboardUI | undefined>(undefined);

export function DashboardUIProvider({ children }: { children: ReactNode }) {
	const [active, setActive] = useState<NavItemId>(NavigationType.Dashboard);

	const value = useMemo(
		() => ({
			active,
			setActive,
		}),
		[active]
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
