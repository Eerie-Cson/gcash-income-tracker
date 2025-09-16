"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !user) {
			router.replace("/");
		}
	}, [isLoading, user, router]);

	if (isLoading || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	return <>{children}</>;
}
