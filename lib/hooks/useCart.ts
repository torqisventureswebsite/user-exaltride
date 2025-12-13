"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  fetchCartItems,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  clearCart as clearCartAPI,
  mergeGuestCart,
  getGuestSessionId,
} from "@/lib/cart-api";

export interface CartItem {
  productId: string;
  quantity: number;
  [key: string]: any;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

export function useCart() {
  const { user, tokens } = useAuth();
  const token = tokens?.authToken || null;
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCartItems(token);
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
      console.error("Error fetching cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Add item to cart
  const addItem = useCallback(
    async (item: CartItem) => {
      try {
        setError(null);
        await addItemToCart(item, token);
        await fetchCart();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add item";
        setError(message);
        return { success: false, error: message };
      }
    },
    [token, fetchCart]
  );

  // Update item quantity
  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      try {
        setError(null);
        await updateCartItem(productId, { quantity }, token);
        await fetchCart();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update item";
        setError(message);
        return { success: false, error: message };
      }
    },
    [token, fetchCart]
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (productId: string) => {
      try {
        setError(null);
        await deleteCartItem(productId, token);
        await fetchCart();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to remove item";
        setError(message);
        return { success: false, error: message };
      }
    },
    [token, fetchCart]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      await clearCartAPI(token);
      await fetchCart();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to clear cart";
      setError(message);
      return { success: false, error: message };
    }
  }, [token, fetchCart]);

  // Merge guest cart after login
  const mergeCart = useCallback(async () => {
    if (!token) return { success: false, error: "No token available" };
    
    try {
      setError(null);
      await mergeGuestCart(token);
      await fetchCart();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to merge cart";
      setError(message);
      return { success: false, error: message };
    }
  }, [token, fetchCart]);

  // Fetch cart on mount and when user/token changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Auto-merge cart when user logs in
  useEffect(() => {
    if (user && token) {
      const guestSessionId = getGuestSessionId();
      if (guestSessionId && guestSessionId.startsWith("guest_")) {
        mergeCart();
      }
    }
  }, [user, token, mergeCart]);

  return {
    cart,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    mergeCart,
    refetch: fetchCart,
  };
}
