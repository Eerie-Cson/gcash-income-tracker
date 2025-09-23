import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactions, transferTransaction } from "@/api/transaction";
import { Transaction, TransactionType } from "@/utils/types";

type CreatePayload = {
	transactionType: TransactionType.CASH_IN | TransactionType.CASH_OUT;
	amount: number;
	customerName?: string;
	customerPhone?: string;
	notes?: string;
	referenceNumber?: string;
};

type CustomerTransaction = Transaction & {
	customerName?: string;
	referenceNumber?: string;
	customerPhone?: string;
};

export function useTransactionsApi() {
	const { token } = useAuth();

	const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchTransactions = useCallback(async () => {
		if (!token) return;
		setLoading(true);
		setError(null);

		try {
			const data = await getTransactions();
			setTransactions(
				(data || []).map((t: any, i: number) => ({
					...t,
					id: t.id ?? (i + 1).toString(),
					transactionDate: t.transactionDate
						? new Date(t.transactionDate)
						: new Date(),
					profit: t.profit ?? 0,
				}))
			);
		} catch (err: any) {
			setError(err instanceof Error ? err : new Error(String(err)));
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	const createTransaction = useCallback(
		async (payload: CreatePayload) => {
			if (!token) throw new Error("Not authenticated");
			if (!payload.amount || payload.amount <= 0)
				throw new Error("Amount must be > 0");

			setCreating(true);
			setError(null);

			try {
				const { data: newTransaction } = await transferTransaction({
					transactionType: payload.transactionType,
					amount: payload.amount,
					description: payload.notes,
					referenceNumber: payload.referenceNumber,
					profit: 0,
					transactionDate: new Date().toISOString(),
					customerName: payload.customerName,
					customerPhone: payload.customerPhone,
				});

				console.log("API Response:", newTransaction);

				setTransactions((prev) => [
					{
						...newTransaction,
						id: newTransaction.id ?? Date.now().toString(),
						transactionDate: new Date(
							newTransaction.transactionDate || new Date()
						),
						profit: newTransaction.profit ?? 0,
						transactionCode: newTransaction.transactionCode,
						customerName: payload.customerName,
						customerPhone: payload.customerPhone,
						referenceNumber: payload.referenceNumber,
						transactionType: payload.transactionType,
					},
					...prev,
				]);

				return true;
			} catch (err: any) {
				setError(err instanceof Error ? err : new Error(String(err)));
				await fetchTransactions();
				throw err;
			} finally {
				setCreating(false);
			}
		},
		[token, fetchTransactions]
	);

	return {
		transactions,
		loading,
		creating,
		error,
		refetch: fetchTransactions,
		createTransaction,
		setTransactions, // keep setter for convenience/tests
	} as const;
}
