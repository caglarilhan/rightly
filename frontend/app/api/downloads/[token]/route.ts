import { NextResponse } from "next/server";
import { backend } from "@/lib/serverClient";
import { assertRateLimit } from "@/lib/rateLimit";
import { assertAllowedRequest } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { token: string } }) {
	// Sıkı rate limit (brute-force önleme)
	const rl = await assertRateLimit(req, "downloads_token_get");
	if (rl) return rl;

	// GET olsa da embed/CSRF benzeri riskler için origin kontrolü (POST gibi değerlendirerek)
	const guard = assertAllowedRequest(new Request(req));
	if (guard) return guard;

	const res = await backend(`/api/v1/downloads/${encodeURIComponent(params.token)}`, { method: "GET" });
	const body = await res.text().catch(() => "");
	return new NextResponse(body, { status: res.status });
}


