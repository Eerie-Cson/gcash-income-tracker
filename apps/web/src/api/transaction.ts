import { TransactionType } from "@/utils/types";
import api, { getToken } from "./axios";

const token = getToken();

export async function getTransactions(params?: {
	page?: number;
	pageSize?: number;
	search?: string;
	type?: string;
	orderBy?: string;
	orderDirection?: "ASC" | "DESC";
}) {
	const queryParams = new URLSearchParams();

	if (params?.page) queryParams.append("page", params.page.toString());
	if (params?.pageSize)
		queryParams.append("pageSize", params.pageSize.toString());

	if (params?.search) queryParams.append("search", params.search);
	if (params?.type) queryParams.append("type", params.type);
	if (params?.orderBy) queryParams.append("orderBy", params.orderBy);
	if (params?.orderDirection)
		queryParams.append("orderDirection", params.orderDirection);

	const res = await api.get(`/transactions?${queryParams.toString()}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	return res.data;
}

export async function transferTransaction(payload: {
	separateFee?: boolean;
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
			...(payload.separateFee ? { separateFee: payload.separateFee } : {}),
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
