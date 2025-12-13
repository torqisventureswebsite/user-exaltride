import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * GET /api/cart - Fetch all cart items
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");

    const headers: HeadersInit = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    if (sessionId) {
      headers["X-Session-Id"] = sessionId;
    }

    const response = await fetch(`${API_BASE_URL}/v1/cart`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error: `Failed to fetch cart: ${error}`, data: [] },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart - Clear all cart items
 */
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");

    const headers: HeadersInit = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    if (sessionId) {
      headers["X-Session-Id"] = sessionId;
    }

    const response = await fetch(`${API_BASE_URL}/v1/cart`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error: `Failed to clear cart: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
