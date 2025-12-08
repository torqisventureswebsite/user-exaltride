import { NextRequest, NextResponse } from "next/server";

// Proxy endpoint to bypass CORS for OTP verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Transform field names if needed (camelCase to snake_case)
    // Backend might expect 'code' instead of 'otp'
    const transformedBody = {
      phone_number: body.phoneNumber || body.phone_number,
      session: body.session,
      code: body.otp || body.code,
    };

    console.log("Verify OTP request body:", JSON.stringify(transformedBody));
    
    // Forward request to actual API
    const response = await fetch(
      "https://k8he8cx9he.execute-api.ap-south-1.amazonaws.com/dev/auth/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedBody),
      }
    );

    const responseText = await response.text();
    console.log("Verify OTP response status:", response.status);
    console.log("Verify OTP response body:", responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    // Return response with proper status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy verify-otp error:", error);
    return NextResponse.json(
      { error: "Failed to connect to authentication service", details: String(error) },
      { status: 500 }
    );
  }
}
