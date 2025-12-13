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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, tokens } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [guestItems, setGuestItems] = useState<CartItem[]>([]); // Guest cart (in-memory only)
  const [isLoading, setIsLoading] = useState(true);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const quantityDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Use guest items when not authenticated, otherwise use server items
  const activeItems = isAuthenticated ? items : guestItems;

  // Calculate total count
  const count = activeItems.reduce((total, item) => total + item.quantity, 0);

  // Get quantity for a specific product
  const getItemQuantity = useCallback((productId: string): number => {
    const item = activeItems.find((i) => i.productId === productId);
    return item?.quantity || 0;
  }, [activeItems]);

  // Get headers for API calls - only for authenticated users
  const getHeaders = useCallback((): HeadersInit | null => {
    if (isAuthenticated && tokens?.idToken) {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.idToken}`,
      };
    }
    return null;
  }, [isAuthenticated, tokens]);

  // Map API response to CartItem format
  const mapApiItemToCartItem = (item: Record<string, unknown>): CartItem => {
    console.log("Mapping API item:", JSON.stringify(item, null, 2));
    
    // Extract productDetails if it exists (nested structure from backend)
    const productDetails = item.productDetails as Record<string, unknown> | undefined;
    
    // Get values from productDetails first, then fall back to top-level properties
    const name = (productDetails?.title || productDetails?.name || item?.product_name || item?.name || item?.title || "") as string;
    const price = (productDetails?.price || item?.price || item?.unit_price || 0) as number;
    const image = (productDetails?.primary_image || productDetails?.image || item?.primary_image || item?.image || "") as string;
    const slug = (productDetails?.slug || item?.slug || item?.product_id || item?.productId) as string | undefined;
    const categoryId = (productDetails?.category_id || item?.category_id || item?.categoryId) as string | undefined;
    const productId = (item.productId || item.product_id || productDetails?.id || productDetails?.slug || item.slug) as string;
    
    return {
      productId,
      name,
      price,
      quantity: (item?.quantity || 1) as number,
      image,
      categoryId,
      slug,
    };
  };

  // Fetch cart from API - only for authenticated users
  // Returns null if there's an error (to distinguish from empty cart)
  const fetchCart = useCallback(async (): Promise<CartItem[] | null> => {
    const headers = getHeaders();
    if (!headers) return [];
    
    try {
      const response = await fetch("/api/cart", { headers });
      const data = await response.json();
      console.log("Raw API response:", JSON.stringify(data, null, 2));
      
      // Check for error response from backend
      if (data.error || !response.ok) {
        console.error("Backend cart error:", data.error || data.message);
        return null; // Return null to indicate error, not empty cart
      }
      
      let rawItems = data.data?.items || data.data || data.items || data.cart || [];
      console.log("Raw items array:", JSON.stringify(rawItems, null, 2));
      
      // Handle case where data.data is a single object instead of an array
      if (rawItems && !Array.isArray(rawItems) && typeof rawItems === 'object') {
        // Check if it's a cart item object (has productId) vs just metadata
        if (rawItems.productId || rawItems.product_id) {
          rawItems = [rawItems];
        } else {
          // It's not a cart item, return empty
          rawItems = [];
        }
      }
      
      // Filter out any items that are just error objects
      const validItems = Array.isArray(rawItems) ? rawItems.filter((item: Record<string, unknown>) => item && !item.error) : [];
      const cartItems = validItems.map(mapApiItemToCartItem);
      console.log("Mapped cart items:", JSON.stringify(cartItems, null, 2));
      return cartItems;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return null;
    }
  }, [getHeaders]);

  // Fetch product details from API for items missing details
  const fetchProductDetails = useCallback(async (productId: string): Promise<Omit<CartItem, "quantity"> | null> => {
    console.log("Fetching product details for:", productId);
    try {
      // Try fetching by ID first
      let response = await fetch(`https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1/products/${productId}`);
      let data = await response.json();
      console.log("Product API response:", JSON.stringify(data, null, 2));
      
      // If not found by ID, the API might need slug - but we only have ID here
      if (!response.ok || data.error) {
        console.log("Product not found by ID, response:", data);
        return null;
      }
      
      const product = data.data || data;
      if (product && (product.title || product.name)) {
        return {
          productId: product.id || productId,
          name: product.title || product.name || "",
          price: product.price || 0,
          image: product.primary_image || product.image || "",
          categoryId: product.category?.id || product.category_id,
          slug: product.slug,
        };
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    return null;
  }, []);

  // Merge API cart with fetched product details for items missing info
  const mergeCartData = useCallback(async (apiCart: CartItem[]): Promise<CartItem[]> => {
    console.log("mergeCartData called with:", JSON.stringify(apiCart, null, 2));
    const mergedItems: CartItem[] = [];
    
    for (const apiItem of apiCart) {
      if (apiItem.name && apiItem.price > 0) {
        mergedItems.push(apiItem);
        continue;
      }
      
      const fetchedDetails = await fetchProductDetails(apiItem.productId);
      if (fetchedDetails && fetchedDetails.name && fetchedDetails.price > 0) {
        mergedItems.push({
          ...fetchedDetails,
          quantity: apiItem.quantity,
        });
        continue;
      }
      
      mergedItems.push(apiItem);
    }
    
    return mergedItems;
  }, [fetchProductDetails]);

  // Refresh cart from API
  const refreshCart = useCallback(async () => {
    console.log("Refreshing cart...");
    if (!tokens?.idToken) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching cart...");
      const cartItems = await fetchCart();
      console.log("Cart items:", cartItems);
      
      // If backend returned an error (null), preserve current cart state
      if (cartItems === null) {
        console.log("Backend error, preserving current cart state");
        return;
      }
      
      const mergedCart = await mergeCartData(cartItems);
      setItems(mergedCart);
      
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart, mergeCartData, tokens]);

  // Sync guest cart items to server when user logs in
  const syncGuestCartToServer = useCallback(async (guestCartItems: CartItem[], headers: HeadersInit) => {
    console.log("Syncing guest cart to server:", guestCartItems.length, "items");
    
    for (const item of guestCartItems) {
      try {
        await fetch("/api/cart/items", {
          method: "POST",
          headers,
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
          }),
        });
        console.log("Synced item to server:", item.productId);
      } catch (error) {
        console.error("Error syncing item to server:", error);
      }
    }
  }, []);

  // Initialize cart on mount and handle auth changes
  useEffect(() => {
    const initCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated && tokens?.idToken) {
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.idToken}`,
          };
          
          // User just logged in - sync guest cart to server first
          if (!wasAuthenticated && guestItems.length > 0) {
            console.log("User logged in with guest cart items, syncing...");
            await syncGuestCartToServer(guestItems, headers);
            // Clear guest cart after sync
            setGuestItems([]);
          }
          
          // Fetch user's cart from API (will include newly synced items)
          const apiCart = await fetchCart();
          
          // If backend returned an error (null), don't clear cart
          if (apiCart === null) {
            console.log("Backend error during init, preserving state");
          } else if (apiCart.length > 0) {
            const mergedCart = await mergeCartData(apiCart);
            setItems(mergedCart);
          } else {
            setItems([]);
          }
          setWasAuthenticated(true);
        } else {
          // User logged out
          if (wasAuthenticated) {
            setItems([]);
            setWasAuthenticated(false);
          }
          // Guest user - keep using guestItems (in-memory only)
        }
      } finally {
        setIsLoading(false);
      }
    };
    refreshCart();
    initCart();
  }, [isAuthenticated, tokens, wasAuthenticated, guestItems, fetchCart, mergeCartData, syncGuestCartToServer]);

  // Add item to cart
  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const quantity = item.quantity || 1;
    const headers = getHeaders();
    
    if (headers) {
      // Authenticated user - sync to server
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.productId === item.productId);
        if (existingIndex > -1) {
          const newCart = [...prev];
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + quantity,
          };
          return newCart;
        } else {
          return [...prev, { ...item, quantity }];
        }
      });

      fetch("/api/cart/items", {
        method: "POST",
        headers,
        body: JSON.stringify({
          productId: item.productId,
          quantity,
        }),
      }).catch((error) => console.error("Error adding to cart:", error));
    } else {
      // Guest user - add to in-memory guest cart only
      setGuestItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.productId === item.productId);
        if (existingIndex > -1) {
          const newCart = [...prev];
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + quantity,
          };
          return newCart;
        } else {
          return [...prev, { ...item, quantity }];
        }
      });
    }
  }, [getHeaders]);

  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    const headers = getHeaders();
    
    if (headers) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
        headers,
      }).catch((error) => console.error("Error removing from cart:", error));
    } else {
      // Guest user - remove from in-memory cart
      setGuestItems((prev) => prev.filter((item) => item.productId !== productId));
    }
  }, [getHeaders]);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    const headers = getHeaders();
    
    if (headers) {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );

      if (quantityDebounceRef.current[productId]) {
        clearTimeout(quantityDebounceRef.current[productId]);
      }

      quantityDebounceRef.current[productId] = setTimeout(() => {
        fetch(`/api/cart/items/${productId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ quantity }),
        }).catch((error) => console.error("Error updating quantity:", error));

        delete quantityDebounceRef.current[productId];
      }, 300);
    } else {
      // Guest user - update in-memory cart
      setGuestItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [getHeaders, removeItem]);

  // Clear cart
  const clearCart = useCallback(() => {
    const headers = getHeaders();
    
    if (headers) {
      setItems([]);
      fetch("/api/cart", {
        method: "DELETE",
        headers,
      }).catch((error) => console.error("Error clearing cart:", error));
    } else {
      // Guest user - clear in-memory cart
      setGuestItems([]);
    }
  }, [getHeaders]);

  return (
    <CartContext.Provider
      value={{
        items: activeItems,
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
