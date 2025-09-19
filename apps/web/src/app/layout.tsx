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
			<body>
				<AuthProvider>
					<DashboardUIProvider>{children}</DashboardUIProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
