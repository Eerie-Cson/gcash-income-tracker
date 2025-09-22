"use client";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { loginApi, registerApi, logoutUser } from "@/api/auth";

interface Account {
	id: string;
	email: string;
	name: string;
}

interface AuthContextType {
	account: Account | null;
	token: string | null;
	login: (email: string, password: string) => Promise<boolean>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [account, setAccount] = useState<Account | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem("authToken");
		const storedUser = localStorage.getItem("account");

		if (
			!storedToken ||
			!storedUser ||
			storedToken === undefined ||
			storedUser === undefined
		) {
			console.warn("No stored token or user found in localStorage.");
			setIsLoading(false);
			return;
		}

		try {
			const parsedUser = JSON.parse(storedUser);
			if (
				typeof parsedUser !== "object" ||
				!parsedUser.id ||
				!parsedUser.email
			) {
				throw new Error("Invalid stored user data.");
			}

			setToken(storedToken);
			setAccount(parsedUser);
		} catch (err) {
			console.error("Error loading user data from localStorage:", err);
			localStorage.removeItem("authToken");
			localStorage.removeItem("account");
			setToken(null);
			setAccount(null);
		}

		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const result = await loginApi(email, password);

			const data = result.data;
			if (!data.accessToken || !data.account) {
				throw new Error("Invalid token received during login.");
			}
			setToken(data.accessToken);
			setAccount(data.account);
			localStorage.setItem("authToken", data.accessToken);
			localStorage.setItem("account", JSON.stringify(data.account));
			return true;
		} catch (err) {
			console.error("Login failed", err);
			return false;
		}
	};

	const register = async (email: string, password: string, name: string) => {
		try {
			const data = await registerApi(email, password, name);
			if (!data.accessToken || !data.account) {
				throw new Error("Invalid token received after registration.");
			}
			setToken(data.accessToken);
			setAccount(data.account);
			localStorage.setItem("authToken", data.accessToken);
			localStorage.setItem("account", JSON.stringify(data.account));
		} catch (err) {
			console.error("Register failed", err);
		}
	};

	const logout = () => {
		logoutUser();
	};

	return (
		<AuthContext.Provider
			value={{ account, token, login, register, logout, isLoading }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
