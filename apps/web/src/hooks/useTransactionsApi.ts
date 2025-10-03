import { getTransactions, transferTransaction } from "@/api/transaction";
import { useAuth } from "@/contexts/AuthContext";
import { Transaction, TransactionType } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";

export type CreatePayload = {
	transactionType: TransactionType.CASH_IN | TransactionType.CASH_OUT;
	separateFee?: boolean;
	amount: number;
	customerName?: string;
	customerPhone?: string;
	notes?: string;
	referenceNumber?: string;
	transactionDate: string;
};

export type CustomerTransaction = Transaction & {
	customerName?: string;
	referenceNumber?: string;
	customerPhone?: string;
};

type PaginationData = {
	data: CustomerTransaction[];
	total: number;
	page: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
};

export function useTransactionsApi() {
	const { token } = useAuth();

	const [paginationData, setPaginationData] = useState<PaginationData>({
		data: [],
		total: 0,
		page: 1,
		totalPages: 1,
		hasNext: false,
		hasPrev: false,
	});
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const refreshBalances = useCallback(async () => {
		// Might need to implement a proper cache invalidation strategy

		window.dispatchEvent(new CustomEvent("balancesShouldRefresh"));
	}, []);

	const fetchPaginatedTransactions = useCallback(
		async (
			params: {
				page?: number;
				limit?: number;
				search?: string;
				type?: string;
			} = {}
		) => {
			if (!token) return;
			setLoading(true);
			setError(null);

			try {
				const data = await getTransactions({
					page: params.page || 1,
					pageSize: params.limit || 10,
					search: params.search,
					type: params.type,
					orderBy: "transactionDate",
					orderDirection: "DESC",
				});

				setPaginationData({
					data: (data.data || []).map((t: Transaction, i: number) => ({
						...t,
						id: t.id ?? (i + 1).toString(),
						transactionDate: new Date(t.transactionDate),
						profit: t.profit ?? 0,
					})),
					total: data.total || 0,
					page: data.page || 1,
					totalPages: data.totalPages || 1,
					hasNext: data.hasNext || false,
					hasPrev: data.hasPrev || false,
				});
			} catch (err: unknown) {
				setError(err instanceof Error ? err : new Error(String(err)));
			} finally {
				setLoading(false);
			}
		},
		[token]
	);

	useEffect(() => {
		fetchPaginatedTransactions({ page: 1, limit: 10 });
	}, [fetchPaginatedTransactions]);

	const createTransaction = useCallback(
		async (payload: CreatePayload) => {
			if (!token) throw new Error("Not authenticated");
			if (!payload.amount || payload.amount <= 0)
				throw new Error("Amount must be > 0");

			setCreating(true);
			setError(null);

			try {
				await transferTransaction({
					...(payload.separateFee ? { separateFee: payload.separateFee } : {}),
					transactionType: payload.transactionType,
					amount: payload.amount,
					description: payload.notes,
					referenceNumber: payload.referenceNumber,
					profit: 0,
					transactionDate: new Date(payload.transactionDate).toISOString(),
					customerName: payload.customerName,
					customerPhone: payload.customerPhone,
				});

				await fetchPaginatedTransactions({ page: 1 });
				await refreshBalances();
				return true;
			} catch (err: unknown) {
				setError(err instanceof Error ? err : new Error(String(err)));
				throw err;
			} finally {
				setCreating(false);
			}
		},
		[token, fetchPaginatedTransactions, refreshBalances]
	);

	return {
		transactions: paginationData.data,
		pagination: paginationData,
		loading,
		creating,
		error,
		refetch: fetchPaginatedTransactions,
		createTransaction,
	} as const;
}
