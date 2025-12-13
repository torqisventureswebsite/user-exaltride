/**
 * Cart API utilities for interacting with the backend cart service
 */

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * Generate or retrieve guest session ID
 */
export function getGuestSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem("guest_session_id");
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("guest_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Clear guest session ID (after login/merge)
 */
export function clearGuestSessionId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("guest_session_id");
  }
}

/**
 * Get auth headers based on login status
 */
export function getCartHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["X-session-id"] = getGuestSessionId();
  }

  return headers;
}

/**
 * Fetch all cart items
 */
export async function fetchCartItems(token?: string | null) {
  const response = await fetch(`${API_BASE_URL}/v1/cart`, {
    method: "GET",
    headers: getCartHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cart: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Add item to cart
 */
export async function addItemToCart(
  item: {
    productId: string;
    quantity: number;
    [key: string]: any;
  },
  token?: string | null
) {
  const response = await fetch(`${API_BASE_URL}/v1/cart/items`, {
    method: "POST",
    headers: getCartHeaders(token),
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(`Failed to add item to cart: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  productId: string,
  data: { quantity: number; [key: string]: any },
  token?: string | null
) {
  const response = await fetch(`${API_BASE_URL}/v1/cart/items/${productId}`, {
    method: "PUT",
    headers: getCartHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update cart item: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete specific cart item
 */
export async function deleteCartItem(productId: string, token?: string | null) {
  const response = await fetch(`${API_BASE_URL}/v1/cart/items/${productId}`, {
    method: "DELETE",
    headers: getCartHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete cart item: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Clear entire cart
 */
export async function clearCart(token?: string | null) {
  const response = await fetch(`${API_BASE_URL}/v1/cart`, {
    method: "DELETE",
    headers: getCartHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to clear cart: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Merge guest cart with user cart after login
 */
export async function mergeGuestCart(token: string) {
  const guestSessionId = getGuestSessionId();
  
  if (!guestSessionId || guestSessionId.startsWith("guest_") === false) {
    return { success: true, message: "No guest cart to merge" };
  }

  const response = await fetch(`${API_BASE_URL}/v1/cart/merge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-session-id": guestSessionId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to merge cart: ${response.statusText}`);
  }

  // Clear guest session after successful merge
  clearGuestSessionId();

  return response.json();
}
