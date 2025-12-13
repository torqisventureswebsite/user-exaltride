import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * PUT /api/orders/[orderId]/cancel - Cancel an order
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Authorization required" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/v1/orders/${orderId}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to cancel order" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
