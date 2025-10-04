import axios from "axios";
import { logoutUser } from "./auth";

export function getToken() {
	if (typeof window !== "undefined") {
		return localStorage.getItem("authToken");
	}
	return null;
}

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
});
console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			const requestUrl = error.config?.url;
			if (
				error.response?.status === 401 &&
				requestUrl !== "/auth/login" &&
				requestUrl !== "/auth/register"
			) {
				logoutUser();
			}
			return Promise.reject(error);
		} else {
			console.log(error);
		}
	}
);

export default api;
