// src/components/auth/LoginForm.tsx
"use client";
import { useState } from "react";
import {
	Eye,
	EyeOff,
	User,
	Lock,
	Smartphone,
	BarChart3,
	Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
	onLogin: (email: string, password: string) => Promise<boolean>;
	onRegister: () => void;
}

export default function LoginForm({ onLogin, onRegister }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const success = await onLogin(email, password);
		if (!success) setError("Invalid email or password");
		else router.push("/dashboard");

		setIsLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-teal-100 via-white to-teal-100 p-6">
			<div className="w-full max-w-lg rounded-2xl shadow-md border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-8">
				{/* Title */}
				<h1 className="text-4xl font-extrabold text-emerald-600 text-center">
					GCash Tracker
				</h1>
				<p className="text-slate-600 text-center mt-1 mb-6">
					Track. Balance. Simplify.
				</p>

				{/* Error */}
				{error && (
					<div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-lg mb-4 text-sm">
						{error}
					</div>
				)}

				{/* Form */}
				<form className="space-y-4" onSubmit={handleSubmit}>
					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Email address
						</label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="block w-full pl-10 pr-3 py-3 rounded-lg border border-emerald-200 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
							/>
						</div>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Password
						</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="block w-full pl-10 pr-12 py-3 rounded-lg border border-emerald-200 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					{/* Sign in */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50"
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</button>
				</form>

				{/* Register */}
				<div className="mt-6 text-center">
					<button
						onClick={onRegister}
						className="text-sm text-slate-600 hover:text-slate-900"
					>
						Don’t have an account?{" "}
						<span className="font-medium text-emerald-600">Register</span>
					</button>
				</div>

				{/* Feature preview cards */}
				<div className="grid grid-cols-3 gap-4 mt-8">
					<Feature
						icon={<Smartphone className="h-6 w-6 text-emerald-600" />}
						label="Mobile"
					/>
					<Feature
						icon={<BarChart3 className="h-6 w-6 text-indigo-600" />}
						label="Insights"
					/>
					<Feature
						icon={<Wallet className="h-6 w-6 text-rose-600" />}
						label="Balance"
					/>
				</div>
			</div>
		</div>
	);
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
	return (
		<div className="text-center">
			<div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white border border-slate-200 shadow-sm">
				{icon}
			</div>
			<p className="text-xs text-slate-600">{label}</p>
		</div>
	);
}
