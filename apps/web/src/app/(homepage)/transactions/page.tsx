"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Transaction from "@/components/transaction/Transaction";

export default function TransactionsPage() {
	return (
		<ProtectedRoute>
			<Transaction />
		</ProtectedRoute>
	);
}
