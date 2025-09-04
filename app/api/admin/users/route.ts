// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:9011";
    const response = await fetch(`${backendUrl}/admin/users`, {
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
        { error: data.detail || "Failed to fetch users" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
