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

		if (storedToken && storedUser) {
			setToken(storedToken);
			setAccount(JSON.parse(storedUser));
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const result = await loginApi(email, password);
			if (!result.success) {
				return false;
			}

			const data = result.data;
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
			const data = await registerApi(email, password, name); // { token, account }
			setToken(data.token);
			setAccount(data.account);
			localStorage.setItem("authToken", data.token);
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
