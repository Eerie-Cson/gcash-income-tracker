import { TransactionType } from "@/utils/types";
import api, { getToken } from "./axios";

const token = getToken();

export async function getTransactions() {
	const res = await api.get("/Transactions", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
}

export async function transferTransaction(payload: {
	transactionType: TransactionType;
	amount: number;
	description?: string;
	referenceNumber?: string;
	profit?: number;
	transactionDate?: string;
	customerName?: string;
	customerPhone?: string;
}) {
	const res = await api.post(
		"/Transactions",
		{
			transactionType: payload.transactionType,
			amount: payload.amount,
			description: payload.description,
			referenceNumber: payload.referenceNumber,
			profit: payload.profit ?? 0,
			transactionDate: payload.transactionDate ?? new Date().toISOString(),
			customerName: payload.customerName,
			customerPhone: payload.customerPhone,
		},
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return res.data;
}
