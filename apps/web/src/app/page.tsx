"use client";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/auth/Login";
import Dashboard from "../components/dashboard/Dashboard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();
	const { account, isLoading, token, login } = useAuth();

	useEffect(() => {
		if (!isLoading && account && token) {
			router.replace("/dashboard");
		}
	}, [isLoading, account, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	if (!account || !token) {
		return (
			<LoginForm
				onLogin={login}
				onRegister={() => {
					router.push("/register");
				}}
			/>
		);
	}

	return <Dashboard />;
}
