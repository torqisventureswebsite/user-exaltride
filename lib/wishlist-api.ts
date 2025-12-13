/**
 * Wishlist API utilities for interacting with the backend wishlist service
 * Uses Next.js API routes as proxy to bypass CORS
 */

/**
 * Get or create guest session ID (UUID format required)
 */
export function getWishlistGuestId(): string {
  if (typeof window === "undefined") return "";
  
  let guestId = localStorage.getItem("wishlist_guest_id");
  if (!guestId) {
    // Generate UUID v4
    guestId = crypto.randomUUID();
    localStorage.setItem("wishlist_guest_id", guestId);
  }
  return guestId;
}

/**
 * Clear guest wishlist ID (after merge on login)
 */
export function clearWishlistGuestId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("wishlist_guest_id");
  }
}

/**
 * Get headers for wishlist API calls
 */
export function getWishlistHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["X-Session-ID"] = getWishlistGuestId();
  }

  return headers;
}

export interface WishlistProduct {
  id: string;
  productId: string;
  title?: string;
  name?: string;
  price?: number;
  primary_image?: string;
  image?: string;
  slug?: string;
  brand_name?: string;
  in_stock?: boolean;
  createdAt?: string;
}

export interface WishlistResponse {
  success: boolean;
  data?: WishlistProduct[];
  message?: string;
  error?: string;
}

/**
 * Toggle product in wishlist (add if not present, remove if present)
 */
export async function toggleWishlistItem(
  productId: string,
  token?: string | null
): Promise<WishlistResponse> {
  const response = await fetch("/api/wishlist/toggle", {
    method: "POST",
    headers: getWishlistHeaders(token),
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to toggle wishlist item: ${error}`);
  }

  return response.json();
}

/**
 * Get all wishlist products
 */
export async function getWishlistItems(
  token?: string | null
): Promise<WishlistResponse> {
  const response = await fetch("/api/wishlist/list", {
    method: "GET",
    headers: getWishlistHeaders(token),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch wishlist: ${error}`);
  }

  return response.json();
}

/**
 * Merge guest wishlist into logged-in account
 */
export async function mergeGuestWishlist(token: string): Promise<WishlistResponse> {
  const guestId = getWishlistGuestId();
  
  if (!guestId) {
    return { success: true, message: "No guest wishlist to merge" };
  }

  const response = await fetch("/api/wishlist/merge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ guestId }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to merge wishlist: ${error}`);
  }

  // Clear guest ID after successful merge
  clearWishlistGuestId();

  return response.json();
}
