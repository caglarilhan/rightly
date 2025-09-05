import { NextResponse } from "next/server";
import { backend } from "@/lib/serverClient";
import { assertRateLimit } from "@/lib/rateLimit";
import { assertAllowedRequest } from "@/lib/security";
import { ensureReqId } from "@/lib/reqId";

export const runtime = "nodejs";

export async function POST(req: Request) {
	const rid = ensureReqId(req);

	const originGuard = assertAllowedRequest(req);
	if (originGuard) {
		const j = await originGuard.json();
		return NextResponse.json(j, { status: 403, headers: { "x-request-id": rid } });
	}

	const rl = await assertRateLimit(req, "auth_magic_link");
	if (rl) {
		const j = await rl.json();
		return NextResponse.json(j, { status: 429, headers: { "x-request-id": rid } });
	}

	const payload = await req.json().catch(() => ({}));
	const res = await backend("/api/v1/auth/magic-link", {
		method: "POST",
		body: JSON.stringify(payload),
		headers: { "content-type": "application/json", "x-request-id": rid },
	});
	const data = await res.json().catch(() => ({}));
	console.log(JSON.stringify({ rid, route: "api/auth/magic-link", beStatus: res.status }));
	return NextResponse.json(data as any, { status: res.status, headers: { "x-request-id": rid } });
}
