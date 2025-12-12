import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * POST /api/cart/merge - Merge guest cart with user cart after login
 * Requires both Authorization header (Bearer token) and X-session-id header
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");

    // Both headers are required for merge
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Authorization token is required" },
        { status: 401 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Guest session ID is required" },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": authHeader,
      "X-Session-Id": sessionId,
    };

    const response = await fetch(`${API_BASE_URL}/v1/cart/merge`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error: `Failed to merge cart: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error merging cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to merge cart" },
      { status: 500 }
    );
  }
}
