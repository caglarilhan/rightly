export function ensureReqId(req?: Request) {
	return req?.headers.get("x-request-id") ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
}


