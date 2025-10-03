import api, { getToken } from "./axios";

const token = getToken();

export type DashboardStats = {
	todayCount: number;
	weeklyAverage: number;
	largestTransaction: number;
	todaysProfit: number;
};

export async function getProfitSummary() {
	const response = await api.get("/reports/profit-summary", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
	const response = await api.get("/reports/dashboard-stats", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}
