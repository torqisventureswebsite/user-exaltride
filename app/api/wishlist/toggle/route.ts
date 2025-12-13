import { NextRequest, NextResponse } from "next/server";

const WISHLIST_API_BASE = "https://k8he8cx9he.execute-api.ap-south-1.amazonaws.com/dev/wishlist";

/**
 * POST /api/wishlist/toggle - Toggle wishlist item (proxy to bypass CORS)
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");
    const body = await request.json();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    if (sessionId) {
      headers["X-Session-ID"] = sessionId;
    }

    const response = await fetch(`${WISHLIST_API_BASE}/toggle`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error: `Failed to toggle wishlist: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle wishlist" },
      { status: 500 }
    );
  }
}
