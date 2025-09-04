const ALLOWED = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3001,http://127.0.0.1:3001")
	.split(",")
	.map(s => s.trim().toLowerCase());

export function isAllowedOrigin(origin: string | null) {
	if (!origin) return false;
	try {
		const o = new URL(origin);
		const norm = `${o.protocol}//${o.host}`.toLowerCase();
		return ALLOWED.includes(norm);
	} catch {
		return false;
	}
}

export function assertAllowedRequest(req: Request) {
	const method = req.method.toUpperCase();
	if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return null;

	const origin = req.headers.get("origin");
	const host = req.headers.get("host");
	const xfHost = req.headers.get("x-forwarded-host") || host;

	const ok = isAllowedOrigin(origin);
	if (!ok) {
		return Response.json(
			{ error: { code: "FORBIDDEN_ORIGIN", message: "Origin not allowed" } },
			{ status: 403 }
		);
	}

	if (!xfHost) {
		return Response.json(
			{ error: { code: "BAD_HOST", message: "Missing host" } },
			{ status: 400 }
		);
	}

	return null;
}


