"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Transaction from "@/components/transaction/Transaction";
import { TransactionsProvider } from "@/contexts/TransactionsContext";

export default function TransactionsPage() {
	return (
		<ProtectedRoute>
			<TransactionsProvider>
				<Transaction />
			</TransactionsProvider>
		</ProtectedRoute>
	);
}
