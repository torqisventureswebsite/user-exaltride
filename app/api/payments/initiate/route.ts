import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * POST /api/payments/initiate - Initiate payment for an order
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
    console.log("Payment initiate - Request body:", JSON.stringify(body, null, 2));

    const response = await fetch(`${API_BASE_URL}/v1/payments/initiate`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log("Payment initiate - Response status:", response.status);
    console.log("Payment initiate - Response body:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || data.error || "Failed to initiate payment", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Payment initiate error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
