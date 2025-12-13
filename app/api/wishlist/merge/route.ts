import { NextRequest, NextResponse } from "next/server";

const WISHLIST_API_BASE = "https://k8he8cx9he.execute-api.ap-south-1.amazonaws.com/dev/wishlist";

/**
 * POST /api/wishlist/merge - Merge guest wishlist into logged-in account (proxy to bypass CORS)
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Authorization required" },
        { status: 401 }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": authHeader,
    };

    const response = await fetch(`${WISHLIST_API_BASE}/merge-guest`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error: `Failed to merge wishlist: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error merging wishlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to merge wishlist" },
      { status: 500 }
    );
  }
}
