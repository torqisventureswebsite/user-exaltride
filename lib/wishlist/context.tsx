"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/context";

export interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  slug?: string;
  brand_name?: string;
  in_stock?: boolean;
}

interface WishlistContextType {
  items: WishlistItem[];
  count: number;
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, "productId"> & { productId: string }) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const GUEST_ID_KEY = "wishlist_guest_id";

// Get or create guest session ID
function getGuestId(): string {
  if (typeof window === "undefined") return "";
  
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
}

// Clear guest ID after merge
function clearGuestId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GUEST_ID_KEY);
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, tokens, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const count = items.length;
  
  // Track when component mounts (client-side only)
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Get headers for API calls
  const getHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (isAuthenticated && tokens?.idToken) {
      headers["Authorization"] = `Bearer ${tokens.idToken}`;
    } else {
      const guestId = getGuestId();
      if (guestId) {
        headers["X-Session-ID"] = guestId;
      }
    }

    return headers;
  }, [isAuthenticated, tokens]);

  // Map API response to WishlistItem format
  const mapApiItemToWishlistItem = (item: Record<string, unknown>): WishlistItem => {
    // Handle nested productDetails if present
    const productDetails = item.productDetails as Record<string, unknown> | undefined;
    
    return {
      productId: (item.productId || item.product_id || productDetails?.id || item.id) as string,
      title: (productDetails?.title || item.title || item.name || "") as string,
      price: (productDetails?.price || item.price || 0) as number,
      image: (productDetails?.primary_image || item.primary_image || item.image || "") as string,
      slug: (productDetails?.slug || item.slug) as string | undefined,
      brand_name: (productDetails?.brand_name || item.brand_name) as string | undefined,
      in_stock: (productDetails?.in_stock ?? item.in_stock ?? true) as boolean,
    };
  };

  // Fetch wishlist from API
  const fetchWishlist = useCallback(async (): Promise<WishlistItem[]> => {
    // Don't fetch during SSR
    if (typeof window === "undefined") return [];
    
    const headers = getHeaders();
    console.log("Fetching wishlist with headers:", headers);
    
    // Ensure we have either auth token or guest ID
    if (!headers["Authorization"] && !headers["X-Session-ID"]) {
      console.log("No auth token or guest ID, skipping wishlist fetch");
      return [];
    }
    
    try {
      const response = await fetch("/api/wishlist/list", { headers });
      const data = await response.json();
      console.log("Wishlist API response:", JSON.stringify(data, null, 2));

      if (response.ok) {
        const rawItems = data.data || data.items || [];
        
        if (Array.isArray(rawItems)) {
          return rawItems.map(mapApiItemToWishlistItem);
        }
      } else {
        console.error("Wishlist API error:", data.error || data.message);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
    return [];
  }, [getHeaders]);

  // Merge guest wishlist to user account
  const mergeGuestWishlist = useCallback(async () => {
    const guestId = getGuestId();
    if (!guestId || !tokens?.idToken) return;

    try {
      console.log("Merging guest wishlist...");
      const response = await fetch("/api/wishlist/merge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokens.idToken}`,
        },
        body: JSON.stringify({ guestId }),
      });

      if (response.ok) {
        console.log("Guest wishlist merged successfully");
        clearGuestId();
      }
    } catch (error) {
      console.error("Error merging guest wishlist:", error);
    }
  }, [tokens]);

  // Refresh wishlist from API
  const refreshWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const wishlistItems = await fetchWishlist();
      setItems(wishlistItems);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWishlist]);

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId: string): boolean => {
    return items.some((item) => item.productId === productId);
  }, [items]);

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleItem = useCallback(async (item: Omit<WishlistItem, "productId"> & { productId: string }) => {
    const isCurrentlyInWishlist = isInWishlist(item.productId);

    // Optimistic update
    if (isCurrentlyInWishlist) {
      setItems((prev) => prev.filter((i) => i.productId !== item.productId));
    } else {
      setItems((prev) => [...prev, item as WishlistItem]);
    }

    try {
      const response = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId: item.productId }),
      });

      if (!response.ok) {
        // Revert on error
        if (isCurrentlyInWishlist) {
          setItems((prev) => [...prev, item as WishlistItem]);
        } else {
          setItems((prev) => prev.filter((i) => i.productId !== item.productId));
        }
        console.error("Failed to toggle wishlist item");
      }
    } catch (error) {
      // Revert on error
      if (isCurrentlyInWishlist) {
        setItems((prev) => [...prev, item as WishlistItem]);
      } else {
        setItems((prev) => prev.filter((i) => i.productId !== item.productId));
      }
      console.error("Error toggling wishlist item:", error);
    }
  }, [getHeaders, isInWishlist]);

  // Remove item from wishlist
  const removeItem = useCallback(async (productId: string) => {
    const removedItem = items.find((i) => i.productId === productId);
    
    // Optimistic update
    setItems((prev) => prev.filter((i) => i.productId !== productId));

    try {
      const response = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId }),
      });

      if (!response.ok && removedItem) {
        // Revert on error
        setItems((prev) => [...prev, removedItem]);
        console.error("Failed to remove wishlist item");
      }
    } catch (error) {
      if (removedItem) {
        setItems((prev) => [...prev, removedItem]);
      }
      console.error("Error removing wishlist item:", error);
    }
  }, [getHeaders, items]);

  // Initialize wishlist on mount and handle auth changes
  useEffect(() => {
    // Wait for client-side mount and auth to finish loading
    if (!hasMounted || authLoading) {
      return;
    }
    
    const initWishlist = async () => {
      console.log("Initializing wishlist, isAuthenticated:", isAuthenticated, "hasToken:", !!tokens?.idToken);
      setIsLoading(true);
      try {
        // User just logged in - merge guest wishlist first
        if (isAuthenticated && tokens?.idToken && !wasAuthenticated) {
          await mergeGuestWishlist();
          setWasAuthenticated(true);
        } else if (!isAuthenticated && wasAuthenticated) {
          // User logged out
          setWasAuthenticated(false);
        }

        // Fetch wishlist (works for both guest and authenticated users)
        const wishlistItems = await fetchWishlist();
        console.log("Wishlist items fetched:", wishlistItems.length);
        setItems(wishlistItems);
      } finally {
        setIsLoading(false);
      }
    };

    initWishlist();
  }, [hasMounted, authLoading, isAuthenticated, tokens, wasAuthenticated, fetchWishlist, mergeGuestWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        count,
        isLoading,
        isInWishlist,
        toggleItem,
        removeItem,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
