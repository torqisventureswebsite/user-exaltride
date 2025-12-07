import { NextRequest, NextResponse } from "next/server";

// Mock signup endpoint for development
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, name, role } = body;

    if (!phoneNumber || !name || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`[Mock Auth] Signup request for: ${phoneNumber}`);
    console.log(`[Mock Auth] Name: ${name}, Role: ${role}`);

    // Mock session ID
    const session = `mock-session-${Date.now()}`;

    return NextResponse.json({
      success: true,
      session,
      message: "Signup successful. OTP sent (mock)",
    });
  } catch (error) {
    console.error("Mock signup error:", error);
    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}
