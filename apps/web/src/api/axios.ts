// src/api/axios.ts
import axios from "axios";
import { logoutUser } from "./auth";

export function getToken() {
	if (typeof window !== "undefined") {
		return localStorage.getItem("authToken");
	}
	return null;
}

const api = axios.create({
	baseURL: "http://localhost:3000", // adjust if needed
	headers: {
		"Content-Type": "application/json",
	},
});

// Add token automatically to requests
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
