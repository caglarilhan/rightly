import { getApiBase } from "@/lib/serverEnv";

export async function api(path: string, init?: RequestInit) {
	const base = getApiBase();
	const url = `${base}${path}`;
	const res = await fetch(url, {
		headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
		...init,
	});

	const text = await res.text();
	const isJson = (res.headers.get("content-type") || "").includes("application/json");
	const data = isJson && text ? JSON.parse(text) : text;

	if (!res.ok) {
		const err: any = new Error(`API ${res.status}`);
		err.status = res.status;
		err.body = data;
		throw err;
	}
	return { status: res.status, data, headers: res.headers };
}


// Node runtime (route handlers) için tek nokta wrapper
export async function backend(path: string, init: RequestInit = {}) {
	const base = process.env.API_URL || "http://127.0.0.1:9011";
	const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 10_000);

	try {
		const res = await fetch(url, {
			...init,
			cache: "no-store",
			next: { revalidate: 0 },
			signal: controller.signal,
			headers: {
				"content-type": "application/json",
				"x-request-id": (init.headers as any)?.["x-request-id"] ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`),
				...(init.headers || {}),
			},
		});
		return res;
	} finally {
		clearTimeout(timeoutId);
	}
}


