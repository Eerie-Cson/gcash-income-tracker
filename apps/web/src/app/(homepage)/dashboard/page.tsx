"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "@/components/dashboard/Dashboard";
import { TransactionsProvider } from "@/contexts/TransactionsContext";

export default function DashboardPage() {
	return (
		<ProtectedRoute>
			<TransactionsProvider>
				<Dashboard />
			</TransactionsProvider>
		</ProtectedRoute>
	);
}
