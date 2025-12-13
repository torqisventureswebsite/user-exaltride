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
const WISHLIST_DETAILS_CACHE_KEY = "exaltride_wishlist_details_cache";
const GUEST_WISHLIST_KEY = "exaltride_guest_wishlist";

// Helper to get guest wishlist from localStorage
const getGuestWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save guest wishlist to localStorage
const saveGuestWishlistToStorage = (items: WishlistItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving guest wishlist:", error);
  }
};

// Helper to clear guest wishlist from localStorage
const clearGuestWishlistFromStorage = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  } catch (error) {
    console.error("Error clearing guest wishlist:", error);
  }
};

// Helper to get cached wishlist product details from localStorage
const getCachedWishlistDetails = (): Record<string, Omit<WishlistItem, "productId"> & { productId: string }> => {
  if (typeof window === "undefined") return {};
  try {
    const cached = localStorage.getItem(WISHLIST_DETAILS_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

// Helper to save wishlist product details to localStorage cache
const setCachedWishlistDetails = (productId: string, details: WishlistItem) => {
  if (typeof window === "undefined") return;
  try {
    const cache = getCachedWishlistDetails();
    cache[productId] = details;
    localStorage.setItem(WISHLIST_DETAILS_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error caching wishlist details:", error);
  }
};

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
  const [items, setItems] = useState<WishlistItem[]>([]); // Server items for authenticated users
  const [guestItems, setGuestItems] = useState<WishlistItem[]>([]); // Guest wishlist (persisted to localStorage)
  const [isLoading, setIsLoading] = useState(true);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Use guest items when not authenticated, otherwise use server items
  const activeItems = isAuthenticated ? items : guestItems;
  const count = activeItems.length;
  
  // Track when component mounts (client-side only)
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Initialize guest wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !hasInitialized && hasMounted) {
      const storedGuestWishlist = getGuestWishlistFromStorage();
      if (storedGuestWishlist.length > 0) {
        console.log("Loaded guest wishlist from localStorage:", storedGuestWishlist.length, "items");
        setGuestItems(storedGuestWishlist);
      }
      setHasInitialized(true);
    }
  }, [hasInitialized, hasMounted]);

  // Save guest wishlist to localStorage whenever it changes
  useEffect(() => {
    if (hasInitialized && !isAuthenticated) {
      saveGuestWishlistToStorage(guestItems);
    }
  }, [guestItems, hasInitialized, isAuthenticated]);

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
    const productId = (item.productId || item.product_id || productDetails?.id || item.id) as string;
    
    let title = (productDetails?.title || item.title || item.name || "") as string;
    let price = (productDetails?.price || item.price || 0) as number;
    let image = (productDetails?.primary_image || item.primary_image || item.image || "") as string;
    let slug = (productDetails?.slug || item.slug) as string | undefined;
    let brand_name = (productDetails?.brand_name || item.brand_name) as string | undefined;
    let in_stock = (productDetails?.in_stock ?? item.in_stock ?? true) as boolean;
    
    // If we have productDetails from API, cache them for future use
    if (productDetails && (productDetails.title || productDetails.name)) {
      setCachedWishlistDetails(productId, {
        productId,
        title,
        price,
        image,
        slug,
        brand_name,
        in_stock,
      });
    }
    
    // If details are missing, try to get from cache
    if (!title || price === 0) {
      const cachedDetails = getCachedWishlistDetails()[productId];
      if (cachedDetails) {
        console.log("Using cached wishlist details for:", productId);
        title = cachedDetails.title || title;
        price = cachedDetails.price || price;
        image = cachedDetails.image || image;
        slug = cachedDetails.slug || slug;
        brand_name = cachedDetails.brand_name || brand_name;
        in_stock = cachedDetails.in_stock ?? in_stock;
      }
    }
    
    return {
      productId,
      title,
      price,
      image,
      slug,
      brand_name,
      in_stock,
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
    return activeItems.some((item) => item.productId === productId);
  }, [activeItems]);

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleItem = useCallback(async (item: Omit<WishlistItem, "productId"> & { productId: string }) => {
    const isCurrentlyInWishlist = isInWishlist(item.productId);

    // Cache product details when adding to wishlist
    if (!isCurrentlyInWishlist) {
      setCachedWishlistDetails(item.productId, item as WishlistItem);
    }

    if (isAuthenticated) {
      // Authenticated user - sync to server
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
    } else {
      // Guest user - store in localStorage only
      if (isCurrentlyInWishlist) {
        setGuestItems((prev) => prev.filter((i) => i.productId !== item.productId));
      } else {
        setGuestItems((prev) => [...prev, item as WishlistItem]);
      }
    }
  }, [getHeaders, isInWishlist, isAuthenticated]);

  // Remove item from wishlist
  const removeItem = useCallback(async (productId: string) => {
    if (isAuthenticated) {
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
    } else {
      // Guest user - remove from localStorage
      setGuestItems((prev) => prev.filter((i) => i.productId !== productId));
    }
  }, [getHeaders, items, isAuthenticated]);

  // Sync guest wishlist items to server when user logs in
  const syncGuestWishlistToServer = useCallback(async (guestWishlistItems: WishlistItem[]) => {
    if (!tokens?.idToken) return;
    
    console.log("Syncing guest wishlist to server:", guestWishlistItems.length, "items");
    
    for (const item of guestWishlistItems) {
      try {
        await fetch("/api/wishlist/toggle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokens.idToken}`,
          },
          body: JSON.stringify({ productId: item.productId }),
        });
        console.log("Synced wishlist item to server:", item.productId);
      } catch (error) {
        console.error("Error syncing wishlist item to server:", error);
      }
    }
  }, [tokens]);

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
        if (isAuthenticated && tokens?.idToken) {
          // User just logged in - sync guest wishlist to server first
          if (!wasAuthenticated && guestItems.length > 0) {
            console.log("User logged in with guest wishlist items, syncing...");
            await syncGuestWishlistToServer(guestItems);
            // Clear guest wishlist after sync (both state and localStorage)
            setGuestItems([]);
            clearGuestWishlistFromStorage();
          }
          
          // Also try the old merge method for any server-side guest data
          await mergeGuestWishlist();
          setWasAuthenticated(true);
          
          // Fetch user's wishlist from API
          const wishlistItems = await fetchWishlist();
          console.log("Wishlist items fetched:", wishlistItems.length);
          setItems(wishlistItems);
        } else {
          // User logged out
          if (wasAuthenticated) {
            setItems([]);
            setWasAuthenticated(false);
            // Clear guest wishlist on logout to start fresh
            setGuestItems([]);
            clearGuestWishlistFromStorage();
          }
          // Guest user - guestItems are loaded from localStorage
          setIsLoading(false);
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    initWishlist();
  }, [hasMounted, authLoading, isAuthenticated, tokens, wasAuthenticated, guestItems, fetchWishlist, mergeGuestWishlist, syncGuestWishlistToServer]);

  return (
    <WishlistContext.Provider
      value={{
        items: activeItems,
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
