"use client";

import { useLocalSettings } from "@/hooks/useLocalSettings";
import { Accent, FontSize, NavigationType, NavItemId } from "@/utils/types";
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
	settingsOpen: boolean;
	setSettingsOpen: SetState<boolean>;
	active: NavItemId;
	setActive: SetState<NavItemId>;
	collapsed: boolean;
	setCollapsed: SetState<boolean>;
	fontSize: FontSize;
	setFontSize: SetState<FontSize>;
	compact: boolean;
	setCompact: SetState<boolean>;
	accent: Accent;
	setAccent: SetState<Accent>;
}

const DashboardUIContext = createContext<DashboardUI | undefined>(undefined);

export function DashboardUIProvider({ children }: { children: ReactNode }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [active, setActive] = useState<NavItemId>(NavigationType.Dashboard);
	const [collapsed, setCollapsed] = useState(false);

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
