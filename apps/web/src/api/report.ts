import api, { getToken } from "./axios";

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
