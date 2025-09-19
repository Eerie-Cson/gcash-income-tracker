// app/(dashboard)/DashboardUIContext.tsx
"use client";

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useMemo,
} from "react";
import { useLocalSettings } from "@/hooks/useLocalSettings";
import { NavItemId } from "@/utils/types";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface DashboardUI {
	mobileOpen: boolean;
	setMobileOpen: SetState<boolean>;
	settingsOpen: boolean;
	setSettingsOpen: SetState<boolean>;
	active: NavItemId;
	setActive: SetState<NavItemId>;
	collapsed: boolean;
	setCollapsed: SetState<boolean>;
	fontSize: any; // ideally replace `any` with your FontSize union type exported from useLocalSettings
	setFontSize: SetState<any>; // <-- important: setter type, not (s: string) => void
	compact: boolean;
	setCompact: SetState<boolean>;
	accent: any; // ideally replace with concrete Accent type
	setAccent: SetState<any>;
}

const DashboardUIContext = createContext<DashboardUI | undefined>(undefined);

export function DashboardUIProvider({ children }: { children: ReactNode }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [active, setActive] = useState<NavItemId>("dashboard");
	const [collapsed, setCollapsed] = useState(false);

	// useLocalSettings already returns setters of the proper type
	const { fontSize, setFontSize, compact, setCompact, accent, setAccent } =
		useLocalSettings({
			fontSize: "large",
			compact: false,
			accent: "emerald",
		});

	const value = useMemo(
		() => ({
			mobileOpen,
			setMobileOpen,
			settingsOpen,
			setSettingsOpen,
			active,
			setActive,
			collapsed,
			setCollapsed,
			fontSize,
			setFontSize,
			compact,
			setCompact,
			accent,
			setAccent,
		}),
		[
			mobileOpen,
			settingsOpen,
			active,
			collapsed,
			fontSize,
			setFontSize,
			compact,
			setCompact,
			accent,
			setAccent,
		]
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
