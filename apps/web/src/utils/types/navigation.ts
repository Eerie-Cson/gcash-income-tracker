export type NavItemId = NavigationType;

export enum NavigationType {
	Dashboard = "dashboard",
	Transactions = "transactions",
	Report = "report",
	Configurations = "configurations",
}
export interface NavItem {
	id: NavItemId;
	label: string;
	icon: React.ComponentType<{ className?: string; size?: number }>;
}
