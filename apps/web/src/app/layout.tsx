import { TransactionsProvider } from "@/contexts/TransactionsContext";
import { AuthProvider } from "../contexts/AuthContext";
import { DashboardUIProvider } from "../contexts/DashboardUIContext";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "GCash Tracker",
	description: "Manage your GCash transactions",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body>
				<AuthProvider>
					<DashboardUIProvider>
						<TransactionsProvider>{children}</TransactionsProvider>
					</DashboardUIProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
