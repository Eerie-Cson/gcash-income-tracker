export type NavItemId = "dashboard" | "transactions" | "report" | "guide";

export enum NavigationType {
	Dashboard = "dashboard",
	Transactions = "transactions",
	Report = "report",
	Guide = "guide",
}
export interface NavItem {
	id: NavItemId;
	label: string;
	icon: React.ComponentType<any>;
}
