import { NextRequest, NextResponse } from "next/server";

// Mock login endpoint for development
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 }
      );
    }

    // Mock session ID
    const session = `mock-session-${Date.now()}`;

    console.log(`[Mock Auth] Login request for: ${phoneNumber}`);
    console.log(`[Mock Auth] Generated session: ${session}`);

    return NextResponse.json({
      success: true,
      session,
      message: "OTP sent successfully (mock)",
    });
  } catch (error) {
    console.error("Mock login error:", error);
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
