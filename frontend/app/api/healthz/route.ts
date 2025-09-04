import { NextResponse } from "next/server";
import { backend } from "@/lib/serverClient";

export const runtime = "nodejs";

export async function GET() {
	try {
		const res = await backend("/healthz");
		const data = await res.json();
		return NextResponse.json({ proxy: "ok", backend: data }, { status: res.status });
	} catch (error) {
		console.error("Health check failed:", error);
		return NextResponse.json(
			{ 
				proxy: "ok", 
				backend: { 
					ok: false, 
					error: "Backend connection failed",
					env: "dev",
					version: "1.0.0"
				} 
			}, 
			{ status: 503 }
		);
	}
}
