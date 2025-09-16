"use client";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";

interface Account {
	id: string;
	email: string;
	name: string;
}

interface AuthContextType {
	account: Account | null;
	register: (email: string, password: string, name: string) => Promise<void>;
	token: string | null;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [account, setUser] = useState<Account | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if account is logged in on component mount
		const storedToken = localStorage.getItem("authToken");
		const storedUser = localStorage.getItem("account");

		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const response = await fetch("http://localhost:3000/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			console.log(response);

			if (response.ok) {
				const data = await response.json();
				console.log(data.accessToken);
				setToken(data.accessToken);
				setUser(data.account);
				localStorage.setItem("authToken", data.accessToken);
				localStorage.setItem("account", JSON.stringify(data.account));
				return true;
			}
			return false;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	const register = async (
		email: string,
		password: string,
		name: string
	): Promise<void> => {
		try {
			const response = await fetch("http://localhost:3000/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password, name }),
			});

			if (response.ok) {
				const data = await response.json();
				setToken(data.token);
				setUser(data.account);
				localStorage.setItem("authToken", data.token);
				localStorage.setItem("account", JSON.stringify(data.account));
				return;
			}
			return;
		} catch (error) {
			console.error("Registration error:", error);
			return;
		}
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem("authToken");
		localStorage.removeItem("account");
	};

	return (
		<AuthContext.Provider
			value={{ account, token, register, login, logout, isLoading }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
