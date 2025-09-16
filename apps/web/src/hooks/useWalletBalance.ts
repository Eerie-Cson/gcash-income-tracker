import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

type Balances = { cash: number; gcash: number };

export function useWalletBalances() {
	const { token } = useAuth();
	const [balances, setBalances] = useState<Balances>({ cash: 0, gcash: 0 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!token) return;

		async function fetchBalances() {
			try {
				setLoading(true);

				const res = await fetch("http://localhost:3000/wallets/balances", {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (!res.ok) throw new Error(res.statusText);

				const parsedResult = await res.json();

				setBalances({
					cash: Number(parsedResult.cashBalance),
					gcash: Number(parsedResult.gcashBalance),
				});
			} catch (err: any) {
				setError(err);
			} finally {
				setLoading(false);
			}
		}

		fetchBalances();
	}, [token]);

	return { balances, loading, error };
}
