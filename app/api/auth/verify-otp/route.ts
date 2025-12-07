import { NextRequest, NextResponse } from "next/server";

// Mock OTP verification endpoint for development
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, session, otp } = body;

    if (!phoneNumber || !session || !otp) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Accept any 6-digit OTP for mock
    if (otp.length !== 6) {
      return NextResponse.json(
        { message: "Invalid OTP format" },
        { status: 400 }
      );
    }

    console.log(`[Mock Auth] OTP verification for: ${phoneNumber}`);
    console.log(`[Mock Auth] Session: ${session}`);
    console.log(`[Mock Auth] OTP: ${otp}`);

    // Generate mock tokens
    const mockTokens = {
      authToken: `mock-auth-token-${Date.now()}`,
      idToken: `mock-id-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    };

    // Mock user data
    const user = {
      phoneNumber,
      name: "Test User",
      role: "buyer",
      email: `${phoneNumber}@example.com`,
    };

    return NextResponse.json({
      success: true,
      ...mockTokens,
      user,
      message: "OTP verified successfully (mock)",
    });
  } catch (error) {
    console.error("Mock OTP verification error:", error);
    return NextResponse.json(
      { message: "OTP verification failed" },
      { status: 500 }
    );
  }
}
