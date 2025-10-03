"use client";
import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
	onRegister: (email: string, password: string, name: string) => Promise<void>;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!name.trim()) return setError("Please enter your name");
		if (!email.trim()) return setError("Please enter your email");
		if (password.length < 6)
			return setError("Password must be at least 6 characters");
		if (password !== confirm) return setError("Passwords do not match");

		setIsLoading(true);
		try {
			await onRegister(email, password, name);
			router.push("/dashboard");
		} catch (err: unknown) {
			console.error("Register error", err);
			if (typeof err === "object" && err !== null && "message" in err) {
				setError(
					(err as { message?: string }).message || "Registration failed"
				);
			} else {
				setError("Registration failed");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-teal-100 via-white to-teal-100 p-6">
			<div className="w-full max-w-lg rounded-2xl shadow-md border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-8">
				<h1 className="text-3xl font-extrabold text-emerald-600 text-center">
					Create account
				</h1>
				<p className="text-slate-600 text-center mt-1 mb-6">
					Sign up to start tracking
				</p>

				{error && (
					<div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-lg mb-4 text-sm">
						{error}
					</div>
				)}

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Full name
						</label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Jane Doe"
								className="block w-full pl-10 pr-3 py-3 rounded-lg border border-emerald-200 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Email address
						</label>
						<div className="relative">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="block w-full pl-3 pr-3 py-3 rounded-lg border border-emerald-200 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
							/>
						</div>
					</div>

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

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Confirm password
						</label>
						<input
							type="password"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							placeholder="••••••••"
							className="block w-full pl-3 pr-3 py-3 rounded-lg border border-emerald-200 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50"
					>
						{isLoading ? "Creating account..." : "Create account"}
					</button>
				</form>

				<div className="mt-4 text-center text-sm text-slate-600">
					Already have an account?{" "}
					<button
						onClick={() => router.push("/")}
						className=" cursor-pointer font-medium text-emerald-600"
					>
						Sign in
					</button>
				</div>
			</div>
		</div>
	);
}
