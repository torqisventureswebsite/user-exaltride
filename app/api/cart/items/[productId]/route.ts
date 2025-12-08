import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * PUT /api/cart/items/[productId] - Update cart item quantity
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const authHeader = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");
    const body = await request.json();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    } else if (sessionId) {
      headers["X-session-id"] = sessionId;
    }

    const response = await fetch(`${API_BASE_URL}/v1/cart/items/${productId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error: `Failed to update cart item: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart/items/[productId] - Remove item from cart
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const authHeader = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");

    const headers: HeadersInit = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    } else if (sessionId) {
      headers["X-session-id"] = sessionId;
    }

    const response = await fetch(`${API_BASE_URL}/v1/cart/items/${productId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error: `Failed to delete cart item: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
