// app/api/admin/audit/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50";
    
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:9011";
    const response = await fetch(`${backendUrl}/admin/audit?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Authorization": request.headers.get("Authorization") || "",
        "Content-Type": "application/json",
        "x-request-id": request.headers.get("x-request-id") || "",
      },
      credentials: "include",
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to fetch audit log" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Audit fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
