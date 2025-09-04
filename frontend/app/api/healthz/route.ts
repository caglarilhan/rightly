import { NextResponse } from "next/server";
import { backend } from "@/lib/serverClient";

export const runtime = "nodejs";

export async function GET() {
	const res = await backend("/healthz");
	const data = await res.json();
	return NextResponse.json({ proxy: "ok", backend: data }, { status: res.status });
}


