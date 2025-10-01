import api, { getToken } from "./axios";
export interface DashboardReport {
	summary: {
		totalProfit: number;
		cashInTotal: number;
		cashOutTotal: number;
		transactionCount: number;
		averageProfitPerTransaction: number;
		totalVolume: number;
	};
	trends: Array<{
		date: string;
		profit: number;
		transactionCount: number;
	}>;
	walletBreakdown: Array<{
		walletType: string;
		profit: number;
	}>;
}

const token = getToken();

export async function getProfitSummary() {
	const response = await api.get("/reports/profit-summary", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}
