"use client";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/ui/Spinner";
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
		return <Spinner></Spinner>;
	}

	return <>{children}</>;
}
