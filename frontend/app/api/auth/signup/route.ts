import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, company } = await req.json();
  if (!email || !company) return NextResponse.json({ ok: false }, { status: 400 });

  // TODO: Burada gerçek API'ni çağır:
  // await fetch(process.env.NEXT_PUBLIC_API_URL + "/v1/auth/signup", { ... })

  // sahte gecikme
  await new Promise((r) => setTimeout(r, 800));
  return NextResponse.json({ ok: true });
}
