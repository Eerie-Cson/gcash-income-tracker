// api/wallet.ts
import api, { getToken } from "./axios";

const token = getToken();
export async function getWallets() {
	const res = await api.get("/wallets");
	return res.data;
}

export async function getGcashWallet() {
	const res = await api.get("wallets/gcash", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
}

export async function getCashWallet() {
	const res = await api.get("/wallets/cash", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
}

export async function getWalletBalances() {
	const res = await api.get(`/wallets/balances`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	console.log("resAPI", res.data);
	return res.data;
}
