"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const { account, isLoading, token } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !account && !token) {
			router.replace("/");
		}
	}, [isLoading, account, router]);

	if (isLoading || !account) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	return <>{children}</>;
}
