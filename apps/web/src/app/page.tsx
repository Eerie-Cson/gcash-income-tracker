"use client";
import Spinner from "@/ui/Spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "../components/auth/Login";
import Dashboard from "../components/dashboard/Dashboard";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
	const router = useRouter();
	const { account, isLoading, token, login } = useAuth();

	useEffect(() => {
		if (!isLoading && account && token) {
			router.replace("/dashboard");
		}
	}, [isLoading, account, router]);

	if (isLoading) {
		return <Spinner className="mx-auto mt-20 h-16 w-16 text-primary" />;
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
