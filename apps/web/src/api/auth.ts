import api from "./axios";

export async function loginApi(email: string, password: string) {
	try {
		const res = await api.post("/auth/login", { email, password });
		return { data: res.data, success: true };
	} catch (err: unknown) {
		if (
			typeof err === "object" &&
			err !== null &&
			"response" in err &&
			typeof err.response === "object" &&
			err.response !== null &&
			"status" in err.response &&
			(err.response as { status?: number }).status === 401
		) {
			return { success: false, error: "Invalid credentials" };
		}
		throw err;
	}
}

export async function registerApi(
	email: string,
	password: string,
	name: string
) {
	const res = await api.post("/auth/register", { email, password, name });
	return res.data;
}

export function logoutUser() {
	localStorage.removeItem("authToken");
	localStorage.removeItem("account");

	if (typeof window !== "undefined") {
		window.location.href = "/";
	}
}
