import { NextRequest, NextResponse } from "next/server";

// Proxy endpoint to bypass CORS for OTP verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward request to actual API
    const response = await fetch(
      "https://k8he8cx9he.execute-api.ap-south-1.amazonaws.com/dev/auth/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    // Return response with proper status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy verify-otp error:", error);
    return NextResponse.json(
      { error: "Failed to connect to authentication service" },
      { status: 500 }
    );
  }
}
