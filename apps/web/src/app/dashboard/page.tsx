"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "@/components/dashboard/Dashboard";
import Transaction from "@/components/transaction/Transaction";

export default function DashboardPage() {
	return (
		<ProtectedRoute>
			<Dashboard />
			<Transaction />
		</ProtectedRoute>
	);
}
