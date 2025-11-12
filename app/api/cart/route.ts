import { NextResponse } from "next/server";
import { getCartItems, getCartCount } from "@/lib/cart-actions";

export async function GET() {
  try {
    const items = await getCartItems();
    const count = await getCartCount();
    
    return NextResponse.json({
      items,
      count,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
