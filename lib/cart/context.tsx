"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth/context";

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
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_SESSION_KEY = "guest_cart_session_id";
const LOCAL_CART_KEY = "cart_items";
const PRODUCT_CACHE_KEY = "product_details_cache";

// Generate a unique guest session ID
function generateGuestSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Get or create guest session ID
function getGuestSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
  if (!sessionId) {
    sessionId = generateGuestSessionId();
    localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  }
  return sessionId;
}

// Clear guest session ID (after merge on login)
function clearGuestSessionId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_SESSION_KEY);
}

// Save cart to localStorage (fallback storage)
function saveCartToLocal(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

// Get cart from localStorage
function getCartFromLocal(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Clear local cart
function clearLocalCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_CART_KEY);
}

// Product details cache - stores product info separately from cart
// This cache is never cleared when cart items are removed
type ProductCache = Record<string, Omit<CartItem, "quantity">>;

function getProductCache(): ProductCache {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(PRODUCT_CACHE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function cacheProductDetails(item: CartItem): void {
  if (typeof window === "undefined") return;
  const cache = getProductCache();
  cache[item.productId] = {
    productId: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    categoryId: item.categoryId,
    slug: item.slug,
  };
  localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(cache));
}

function getCachedProductDetails(productId: string): Omit<CartItem, "quantity"> | null {
  const cache = getProductCache();
  return cache[productId] || null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, tokens } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const quantityDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Calculate total count
  const count = items.reduce((total, item) => total + item.quantity, 0);

  // Get quantity for a specific product
  const getItemQuantity = useCallback((productId: string): number => {
    const item = items.find((i) => i.productId === productId);
    return item?.quantity || 0;
  }, [items]);

  // Get headers for API calls
  const getHeaders = useCallback((): HeadersInit => {
    if (isAuthenticated && tokens?.authToken) {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.authToken}`,
      };
    }
    return {
      "Content-Type": "application/json",
      "X-Session-Id": getGuestSessionId(),
    };
  }, [isAuthenticated, tokens]);

  // Map API response to CartItem format
  const mapApiItemToCartItem = (item: Record<string, unknown>): CartItem => ({
    productId: (item.product_id || item.productId || item.slug) as string,
    name: (item.name || item.product_name || "") as string,
    price: (item.price || 0) as number,
    quantity: (item.quantity || 1) as number,
    image: (item.image || item.primary_image || "") as string,
    categoryId: (item.category_id || item.categoryId) as string | undefined,
    slug: item.slug as string | undefined,
  });

  // Fetch cart from API
  const fetchCart = useCallback(async (): Promise<CartItem[]> => {
    try {
      const response = await fetch("/api/cart", { headers: getHeaders() });
      
      if (response.ok) {
        const data = await response.json();
        // API returns { data: [...], meta: {...} }
        const cartItems = (data.data || data.items || data.cart || []).map(mapApiItemToCartItem);
        return cartItems;
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
    return [];
  }, [getHeaders]);

  // Merge guest cart with user cart on login
  const mergeGuestCart = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !tokens?.authToken) return;
    
    // Only merge if there was a guest session
    const guestSessionId = localStorage.getItem(GUEST_SESSION_KEY);
    if (!guestSessionId) return;

    try {
      const response = await fetch("/api/cart/merge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.authToken}`,
          "X-Session-Id": guestSessionId,
        },
      });

      if (response.ok) {
        // Clear guest session after successful merge
        clearGuestSessionId();
      }
    } catch (error) {
      console.error("Error merging cart:", error);
    }
  }, [isAuthenticated, tokens]);

  // Refresh cart from API
  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const cartItems = await fetchCart();
      setItems(cartItems);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart]);

  // Merge API cart with cached product details
  const mergeCartData = useCallback((apiCart: CartItem[]): CartItem[] => {
    return apiCart.map(apiItem => {
      // Check if API item has complete data
      if (apiItem.name && apiItem.price > 0) {
        // Cache the product details for future use
        cacheProductDetails(apiItem);
        return apiItem;
      }
      
      // Try to get product details from cache
      const cachedDetails = getCachedProductDetails(apiItem.productId);
      if (cachedDetails) {
        return {
          ...cachedDetails,
          quantity: apiItem.quantity,
        };
      }
      
      // No cached data, use API data as-is
      return apiItem;
    });
  }, []);

  // Initialize cart on mount and handle auth changes
  useEffect(() => {
    const initCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated && tokens?.authToken) {
          // User just logged in
          if (!wasAuthenticated) {
            // Merge guest cart with user cart
            await mergeGuestCart();
          }
          // Fetch user's cart from API
          const apiCart = await fetchCart();
          
          if (apiCart.length > 0) {
            // Merge API cart with cached product details
            const mergedCart = mergeCartData(apiCart);
            setItems(mergedCart);
            saveCartToLocal(mergedCart);
          } else {
            // Fallback to local storage
            const localCart = getCartFromLocal();
            if (localCart.length > 0) {
              setItems(localCart);
            }
          }
          setWasAuthenticated(true);
        } else {
          if (wasAuthenticated) {
            // User just logged out - clear cart state but keep local cache for product details
            setItems([]);
            clearGuestSessionId();
            // Don't clear local cart - keep it as cache for product details on next login
            setWasAuthenticated(false);
          } else {
            // Guest user - fetch cart from API
            const apiCart = await fetchCart();
            
            if (apiCart.length > 0) {
              // Merge API cart with cached product details
              const mergedCart = mergeCartData(apiCart);
              setItems(mergedCart);
              saveCartToLocal(mergedCart);
            } else {
              // Fallback to local storage
              const localCart = getCartFromLocal();
              if (localCart.length > 0) {
                setItems(localCart);
              }
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initCart();
  }, [isAuthenticated, tokens, wasAuthenticated, fetchCart, mergeGuestCart, mergeCartData]);

  // Add item to cart
  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const quantity = item.quantity || 1;
    
    // Cache product details for future use (persists even after cart is cleared)
    cacheProductDetails({ ...item, quantity } as CartItem);
    
    // Optimistic update and save to local
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === item.productId);
      let newCart: CartItem[];
      if (existingIndex > -1) {
        newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity,
        };
      } else {
        newCart = [...prev, { ...item, quantity }];
      }
      saveCartToLocal(newCart);
      return newCart;
    });

    // Sync to API (fire-and-forget)
    fetch("/api/cart/items", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        productId: item.productId,
        quantity,
      }),
    }).catch((error) => console.error("Error adding to cart:", error));
  }, [getHeaders]);

  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    // Optimistic update and save to local
    setItems((prev) => {
      const newCart = prev.filter((item) => item.productId !== productId);
      saveCartToLocal(newCart);
      return newCart;
    });

    // Sync to API (fire-and-forget)
    fetch(`/api/cart/items/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).catch((error) => console.error("Error removing from cart:", error));
  }, [getHeaders]);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    // Optimistic update and save to local
    setItems((prev) => {
      const newCart = prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      saveCartToLocal(newCart);
      return newCart;
    });

    // Debounce API sync
    if (quantityDebounceRef.current[productId]) {
      clearTimeout(quantityDebounceRef.current[productId]);
    }

    quantityDebounceRef.current[productId] = setTimeout(() => {
      fetch(`/api/cart/items/${productId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      }).catch((error) => console.error("Error updating quantity:", error));

      delete quantityDebounceRef.current[productId];
    }, 300);
  }, [getHeaders, removeItem]);

  // Clear cart
  const clearCart = useCallback(() => {
    // Optimistic update and clear local
    setItems([]);
    clearLocalCart();

    // Sync to API (fire-and-forget)
    fetch("/api/cart", {
      method: "DELETE",
      headers: getHeaders(),
    }).catch((error) => console.error("Error clearing cart:", error));
  }, [getHeaders]);

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
