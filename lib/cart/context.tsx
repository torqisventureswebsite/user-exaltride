"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth/context";
import { 
  addToCart as serverAddToCart, 
  removeFromCart as serverRemoveFromCart, 
  updateCartQuantity as serverUpdateQuantity,
  clearCart as serverClearCart,
  getCartItems as serverGetCartItems 
} from "@/lib/cart-actions";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  categoryId?: string;
  slug?: string;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  isLoading: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_COOKIE_NAME = "cart";

// Helper to get cart from cookies (client-side)
function getCartFromCookies(): CartItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const cookies = document.cookie.split(";");
    const cartCookie = cookies.find((c) => c.trim().startsWith(`${CART_COOKIE_NAME}=`));
    if (!cartCookie) return [];
    
    const value = cartCookie.split("=")[1];
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return [];
  }
}

// Helper to save cart to cookies (client-side)
function saveCartToCookies(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(cart))};path=/;max-age=${maxAge};samesite=lax`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, tokens } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate total count
  const count = items.reduce((total, item) => total + item.quantity, 0);

  // Get quantity for a specific product
  const getItemQuantity = useCallback((productId: string): number => {
    const item = items.find((i) => i.productId === productId);
    return item?.quantity || 0;
  }, [items]);

  // Fetch cart from API (for authenticated users)
  const fetchCartFromAPI = useCallback(async (): Promise<CartItem[]> => {
    if (!isAuthenticated || !tokens?.authToken) return [];

    try {
      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${tokens.authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Map API response to our CartItem format
        return (data.items || []).map((item: any) => ({
          productId: item.product_id || item.productId,
          name: item.name || item.product_name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.primary_image,
          categoryId: item.category_id || item.categoryId,
          slug: item.slug,
        }));
      }
    } catch (error) {
      console.error("Error fetching cart from API:", error);
    }
    return [];
  }, [isAuthenticated, tokens]);

  // Sync cart to API (for authenticated users)
  const syncCartToAPI = useCallback(async (cart: CartItem[]) => {
    if (!isAuthenticated || !tokens?.authToken) return;

    try {
      // Clear existing cart first
      await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokens.authToken}`,
        },
      });

      // Add each item to API cart
      for (const item of cart) {
        await fetch("/api/cart/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.authToken}`,
          },
          body: JSON.stringify({
            product_id: item.productId,
            quantity: item.quantity,
          }),
        });
      }
    } catch (error) {
      console.error("Error syncing cart to API:", error);
    }
  }, [isAuthenticated, tokens]);

  // Merge guest cart with user cart on login
  const mergeCartsOnLogin = useCallback(async () => {
    const guestCart = getCartFromCookies();
    const userCart = await fetchCartFromAPI();

    // Merge: combine quantities for same products, add new products
    const mergedCart = [...userCart];
    
    for (const guestItem of guestCart) {
      const existingIndex = mergedCart.findIndex(
        (item) => item.productId === guestItem.productId
      );
      
      if (existingIndex > -1) {
        // Add quantities
        mergedCart[existingIndex].quantity += guestItem.quantity;
      } else {
        // Add new item
        mergedCart.push(guestItem);
      }
    }

    // Save merged cart
    setItems(mergedCart);
    saveCartToCookies(mergedCart);
    
    // Sync to API
    if (mergedCart.length > 0) {
      await syncCartToAPI(mergedCart);
    }

    return mergedCart;
  }, [fetchCartFromAPI, syncCartToAPI]);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const apiCart = await fetchCartFromAPI();
        if (apiCart.length > 0) {
          setItems(apiCart);
        } else {
          // If API cart is empty, use server cart
          const serverCart = await serverGetCartItems();
          setItems(serverCart);
        }
      } else {
        // Use server action for guest
        const serverCart = await serverGetCartItems();
        setItems(serverCart);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchCartFromAPI]);

  // Track previous auth state to detect logout
  const [wasAuthenticated, setWasAuthenticated] = useState(false);

  // Initialize cart on mount and auth change
  useEffect(() => {
    const initCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          // Merge carts on login
          await mergeCartsOnLogin();
          setWasAuthenticated(true);
        } else {
          // Check if user just logged out
          if (wasAuthenticated) {
            // Clear cart state on logout
            setItems([]);
            setWasAuthenticated(false);
          } else {
            // Load from server action for guest (more reliable than client-side cookie reading)
            const serverCart = await serverGetCartItems();
            setItems(serverCart);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initCart();
  }, [isAuthenticated, mergeCartsOnLogin, wasAuthenticated]);

  // Add item to cart - optimistic update, fire-and-forget API sync
  const addItem = useCallback(async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const quantity = item.quantity || 1;
    
    // Optimistic update - update UI immediately
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === item.productId);
      let newCart: CartItem[];
      
      if (existingIndex > -1) {
        newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
      } else {
        newCart = [...prev, { ...item, quantity }];
      }
      
      return newCart;
    });

    // Fire-and-forget: sync to server cookie (non-blocking)
    serverAddToCart(
      item.productId,
      item.name,
      item.price,
      item.image,
      quantity,
      item.categoryId,
      item.slug
    ).catch((error) => console.error("Error syncing to server:", error));

    // Fire-and-forget: sync to API if authenticated (non-blocking)
    if (isAuthenticated && tokens?.authToken) {
      fetch("/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.authToken}`,
        },
        body: JSON.stringify({
          product_id: item.productId,
          quantity,
        }),
      }).catch((error) => console.error("Error adding item to API cart:", error));
    }
  }, [isAuthenticated, tokens]);

  // Remove item from cart - optimistic update, fire-and-forget API sync
  const removeItem = useCallback(async (productId: string) => {
    // Optimistic update - update UI immediately
    setItems((prev) => prev.filter((item) => item.productId !== productId));

    // Fire-and-forget: sync to server cookie (non-blocking)
    serverRemoveFromCart(productId).catch((error) => 
      console.error("Error syncing remove to server:", error)
    );

    // Fire-and-forget: sync to API if authenticated (non-blocking)
    if (isAuthenticated && tokens?.authToken) {
      fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokens.authToken}`,
        },
      }).catch((error) => console.error("Error removing item from API cart:", error));
    }
  }, [isAuthenticated, tokens]);

  // Debounce ref for quantity updates
  const quantityDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Update item quantity - optimistic update with debounced API sync
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 1) {
      return removeItem(productId);
    }

    // Optimistic update - update UI immediately
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );

    // Clear existing debounce timer for this product
    if (quantityDebounceRef.current[productId]) {
      clearTimeout(quantityDebounceRef.current[productId]);
    }

    // Debounce the server sync (300ms) to batch rapid quantity changes
    quantityDebounceRef.current[productId] = setTimeout(() => {
      // Sync to server cookie
      serverUpdateQuantity(productId, quantity).catch((error) =>
        console.error("Error syncing quantity to server:", error)
      );

      // Sync to API if authenticated
      if (isAuthenticated && tokens?.authToken) {
        fetch(`/api/cart/items/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.authToken}`,
          },
          body: JSON.stringify({ quantity }),
        }).catch((error) => console.error("Error updating item in API cart:", error));
      }

      delete quantityDebounceRef.current[productId];
    }, 300);
  }, [isAuthenticated, tokens, removeItem]);

  // Clear cart - optimistic update, fire-and-forget API sync
  const clearCart = useCallback(async () => {
    // Optimistic update - update UI immediately
    setItems([]);

    // Fire-and-forget: sync to server cookie (non-blocking)
    serverClearCart().catch((error) =>
      console.error("Error syncing clear to server:", error)
    );

    // Fire-and-forget: sync to API if authenticated (non-blocking)
    if (isAuthenticated && tokens?.authToken) {
      fetch("/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokens.authToken}`,
        },
      }).catch((error) => console.error("Error clearing API cart:", error));
    }
  }, [isAuthenticated, tokens]);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
