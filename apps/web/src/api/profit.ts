import api, { getToken } from "./axios";

const token = getToken();

export async function saveTransactionFees(
	profitTiers: { minAmount: number; maxAmount: number; fee: number }[]
) {
	const res = await api.post(
		"/profits/fee-tiers",
		{ profitTiers },
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return res.data;
}

export async function getTransactionFees() {
	const res = await api.get("/profits/fee-tiers", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
}
