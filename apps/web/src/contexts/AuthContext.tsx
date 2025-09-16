"use client";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";

interface User {
	id: string;
	email: string;
	name: string;
}

interface AuthContextType {
	user: User | null;
	register: (email: string, password: string, name: string) => Promise<void>;
	token: string | null;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if user is logged in on component mount
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
				console.log(data);
				setToken(data.token);
				setUser(data.account);
				localStorage.setItem("authToken", data.token);
				localStorage.setItem("user", JSON.stringify(data.user));
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
				setUser(data.user);
				localStorage.setItem("authToken", data.token);
				localStorage.setItem("user", JSON.stringify(data.user));
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
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider
			value={{ user, token, register, login, logout, isLoading }}
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
