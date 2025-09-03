import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ ok: false }, { status: 400 });

  // TODO: Burada gerçek API'ni çağır:
  // await fetch(process.env.NEXT_PUBLIC_API_URL + "/v1/auth/magic-link", { ... })

  // sahte gecikme
  await new Promise((r) => setTimeout(r, 600));
  return NextResponse.json({ ok: true });
}
