import { Home, ListChecks, BarChart3, BookOpen } from "lucide-react";
export const nav = [
	{ id: "dashboard", label: "Dashboard", icon: Home },
	{ id: "transactions", label: "Transactions", icon: ListChecks },
	{ id: "report", label: "Report", icon: BarChart3 },
	{ id: "guide", label: "Guide", icon: BookOpen },
] as const;
