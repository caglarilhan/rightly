type WindowCfg = { points: number; windowMs: number };

const cfg: WindowCfg = {
	points: Number(process.env.RATE_LIMIT_POINTS ?? 60),
	windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
};

// In-memory buckets (dev)
const buckets = new Map<string, { ts: number; count: number }>();

function keyOf(ip: string, route: string) {
	return `${route}::${ip}`;
}

function allowInMemory(ip: string, route: string) {
	const key = keyOf(ip, route);
	const now = Date.now();
	const prev = buckets.get(key);
	if (!prev || now - prev.ts > cfg.windowMs) {
		buckets.set(key, { ts: now, count: 1 });
		return true;
	}
	if (prev.count < cfg.points) {
		prev.count += 1;
		return true;
	}
	return false;
}

async function allowUpstash(ip: string, route: string) {
	const url = process.env.UPSTASH_REDIS_REST_URL as string | undefined;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN as string | undefined;
	if (!url || !token) return null;
	const k = `rl:${route}:${ip}`;
	try {
		const res = await fetch(`${url}/pipeline`, {
			method: "POST",
			headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
			body: JSON.stringify({
				pipeline: [
					["INCR", k],
					["PTTL", k],
					["PEXPIRE", k, cfg.windowMs],
				],
			}),
			cache: "no-store",
		});
		const data = await res.json();
		if (!Array.isArray(data)) return null;
		const current = Number(data[0]?.result ?? 1);
		return current <= cfg.points;
	} catch {
		return null;
	}
}

export async function assertRateLimit(req: Request, routeTag: string) {
	const ip =
		(req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()) ||
		req.headers.get("cf-connecting-ip") ||
		req.headers.get("x-real-ip") ||
		"0.0.0.0";

	const upstash = await allowUpstash(ip, routeTag);
	const ok = upstash === null ? allowInMemory(ip, routeTag) : upstash;
	if (!ok) {
		return Response.json(
			{ error: { code: "RATE_LIMITED", message: "Too many requests" } },
			{ status: 429 }
		);
	}
	return null;
}


