"use client";
import RegisterForm from "@/components/auth/Register";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const router = useRouter();
	const { register, isLoading, account, token } = useAuth();

	useEffect(() => {
		if (!isLoading && account && token) {
			router.replace("/dashboard");
		}
	}, [isLoading, account, token, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
			</div>
		);
	}

	return <RegisterForm onRegister={register} />;
}
