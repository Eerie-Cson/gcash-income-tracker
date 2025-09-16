// src/app/layout.tsx
import { AuthProvider } from "../contexts/AuthContext";
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
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
