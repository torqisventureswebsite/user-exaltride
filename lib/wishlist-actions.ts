"use server";

import { cookies } from "next/headers";

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  brand_name?: string;
  in_stock?: boolean;
}

const WISHLIST_COOKIE = "exaltride_wishlist";

/**
 * Get all wishlist items
 */
export async function getWishlistItems(): Promise<WishlistItem[]> {
  const cookieStore = await cookies();
  const wishlistCookie = cookieStore.get(WISHLIST_COOKIE);
  
  if (!wishlistCookie) {
    return [];
  }

  try {
    return JSON.parse(wishlistCookie.value);
  } catch {
    return [];
  }
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(
  id: string,
  title: string,
  price: number,
  image: string,
  slug: string,
  brand_name?: string,
  in_stock?: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const wishlist = await getWishlistItems();
    
    // Check if item already exists
    const exists = wishlist.some((item) => item.id === id);
    if (exists) {
      return { success: false, message: "Item already in wishlist" };
    }

    // Add new item
    const newItem: WishlistItem = {
      id,
      title,
      price,
      image,
      slug,
      brand_name,
      in_stock,
    };

    wishlist.push(newItem);

    // Save to cookie
    const cookieStore = await cookies();
    cookieStore.set(WISHLIST_COOKIE, JSON.stringify(wishlist), {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    });

    return { success: true, message: "Added to wishlist" };
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return { success: false, message: "Failed to add to wishlist" };
  }
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const wishlist = await getWishlistItems();
    const filtered = wishlist.filter((item) => item.id !== id);

    const cookieStore = await cookies();
    cookieStore.set(WISHLIST_COOKIE, JSON.stringify(filtered), {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });

    return { success: true, message: "Removed from wishlist" };
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return { success: false, message: "Failed to remove from wishlist" };
  }
}

/**
 * Check if item is in wishlist
 */
export async function isInWishlist(id: string): Promise<boolean> {
  const wishlist = await getWishlistItems();
  return wishlist.some((item) => item.id === id);
}

/**
 * Get wishlist count
 */
export async function getWishlistCount(): Promise<number> {
  const wishlist = await getWishlistItems();
  return wishlist.length;
}

/**
 * Clear entire wishlist
 */
export async function clearWishlist(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(WISHLIST_COOKIE, JSON.stringify([]), {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error) {
    console.error("Clear wishlist error:", error);
    return { success: false };
  }
}
