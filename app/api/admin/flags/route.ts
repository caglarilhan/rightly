// app/api/admin/flags/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:9011";
    const response = await fetch(`${backendUrl}/admin/flags`, {
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
        { error: data.detail || "Failed to fetch feature flags" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Flags fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:9011";
    
    const response = await fetch(`${backendUrl}/admin/flags/toggle`, {
      method: "POST",
      headers: {
        "Authorization": request.headers.get("Authorization") || "",
        "Content-Type": "application/json",
        "x-request-id": request.headers.get("x-request-id") || "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to toggle feature flag" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Flag toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
