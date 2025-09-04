// app/api/admin/impersonate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:9011";
    
    const response = await fetch(`${backendUrl}/admin/impersonate`, {
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
        { error: data.detail || "Impersonation failed" },
        { status: response.status }
      );
    }

    // Forward cookies from backend
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      responseHeaders.set("set-cookie", setCookieHeader);
    }

    return NextResponse.json(data, { headers: responseHeaders });
  } catch (error) {
    console.error("Impersonation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:9011";
    
    const response = await fetch(`${backendUrl}/admin/impersonate`, {
      method: "DELETE",
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
        { error: data.detail || "Failed to stop impersonation" },
        { status: response.status }
      );
    }

    // Forward cookie deletion from backend
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      responseHeaders.set("set-cookie", setCookieHeader);
    }

    return NextResponse.json(data, { headers: responseHeaders });
  } catch (error) {
    console.error("Stop impersonation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
