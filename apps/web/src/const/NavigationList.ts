import { NavigationType, NavItem } from "@/utils/types";
import { Home, ListChecks, BarChart3, Sliders } from "lucide-react";

export const nav: NavItem[] = [
	{ id: NavigationType.Dashboard, label: "Dashboard", icon: Home },
	{ id: NavigationType.Transactions, label: "Transactions", icon: ListChecks },
	{ id: NavigationType.Report, label: "Report", icon: BarChart3 },
	{ id: NavigationType.Configurations, label: "Configurations", icon: Sliders },
];
