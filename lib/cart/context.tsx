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
  const mapApiItemToCartItem = (item: Record<string, unknown>): CartItem => ({
    productId: (item.productId || item.productId || item.slug) as string,
    name: (item.name || item.product_name || "") as string,
    price: (item.price || 0) as number,
    quantity: (item.quantity || 1) as number,
    image: (item.image || item.primary_image || "") as string,
    categoryId: (item.category_id || item.categoryId) as string | undefined,
    slug: item.slug as string | undefined,
  });

  // Fetch cart from API - only for authenticated users
  const fetchCart = useCallback(async (): Promise<CartItem[]> => {
    const headers = getHeaders();
    if (!headers) return [];
    
    try {
      const response = await fetch("/api/cart", { headers });
      
      if (response.ok) {
        const data = await response.json();
        const cartItems = (data.data || data.items || data.cart || []).map(mapApiItemToCartItem);
        return cartItems;
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
    return [];
  }, [getHeaders]);

  // Refresh cart from API
  const refreshCart = useCallback(async () => {
    console.log("Refreshing cart...");
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching cart...");
      const cartItems = await fetchCart();
      console.log("Cart items:", cartItems);
      setItems(cartItems);
      
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart, isAuthenticated]);

  // Fetch product details from API for items missing details
  const fetchProductDetails = useCallback(async (productId: string): Promise<Omit<CartItem, "quantity"> | null> => {
    try {
      const response = await fetch(`https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        const product = data.data || data;
        if (product) {
          return {
            productId: product.slug || product.id || productId,
            name: product.title || product.name || "",
            price: product.price || 0,
            image: product.primary_image || product.image || "",
            categoryId: product.category?.id || product.category_id,
            slug: product.slug,
          };
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    return null;
  }, []);

  // Merge API cart with fetched product details for items missing info
  const mergeCartData = useCallback(async (apiCart: CartItem[]): Promise<CartItem[]> => {
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
          
          if (apiCart.length > 0) {
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
