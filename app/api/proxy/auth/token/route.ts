import { NextRequest, NextResponse } from "next/server";

// Proxy endpoint to bypass CORS for Cognito token exchange
// Also injects server-side client_secret since it can't be exposed to client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "exaltride-auth.auth.ap-south-1.amazoncognito.com";
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "";
    const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
    const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || "http://localhost:3000";
    
    // Build token request with server-side secret
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code: body.code,
      redirect_uri: redirectUri,
    });

    console.log("Token exchange - client_id:", clientId);
    console.log("Token exchange - redirect_uri:", redirectUri);
    console.log("Token exchange - code:", body.code?.substring(0, 20) + "...");
    
    // Forward request to Cognito token endpoint
    const response = await fetch(
      `https://${cognitoDomain}/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const responseText = await response.text();
    console.log("Token exchange response status:", response.status);
    console.log("Token exchange response body:", responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { error: responseText };
    }

    // Return response with proper status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy token exchange error:", error);
    return NextResponse.json(
      { error: "Failed to exchange token", details: String(error) },
      { status: 500 }
    );
  }
}
