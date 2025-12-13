import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * POST /api/orders - Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Authorization required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Order API - Request body:", JSON.stringify(body, null, 2));

    const response = await fetch(`${API_BASE_URL}/v1/orders`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log("Order API - Response status:", response.status);
    console.log("Order API - Response body:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || data.error || "Failed to create order", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders - Get all orders
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Authorization required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/v1/orders`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to get orders" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
