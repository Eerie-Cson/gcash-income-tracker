import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export enum TransactionType {
	CASH_IN = "Cash-in",
	CASH_OUT = "Cash-out",
}

type Transaction = {
	description?: string;
	amount: number;
	transactionType: TransactionType;
	referenceNumber?: string;
	transasctionCode?: string;
	transactionDate: Date;
	profit: 0;
};

export function useGetTransactions() {
	const { token } = useAuth();
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!token) return;

		async function fetchTransactions() {
			try {
				setLoading(true);

				const res = await fetch("http://localhost:3000/transactions", {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (!res.ok) throw new Error(res.statusText);

				const parsedResult = await res.json();
				// console.log(parsedResult);

				setTransactions(
					parsedResult.map((t: any) => ({
						...t,
						transactionDate: new Date(t.transactionDate),
						profit: 0,
					}))
				);
			} catch (err: any) {
				setError(err);
			} finally {
				setLoading(false);
			}
		}

		fetchTransactions();
	}, [token]);

	return { transactions, loading, error };
}
