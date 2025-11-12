"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Cart item schema
const CartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  image: z.string(),
  categoryId: z.string().optional(),
});

type CartItem = z.infer<typeof CartItemSchema>;

const CartSchema = z.array(CartItemSchema);

const CART_COOKIE_NAME = "cart";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Get cart from cookies
 */
async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE_NAME);

  if (!cartCookie?.value) {
    return [];
  }

  try {
    const cart = JSON.parse(cartCookie.value);
    return CartSchema.parse(cart);
  } catch {
    return [];
  }
}

/**
 * Save cart to cookies
 */
async function saveCart(cart: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    maxAge: MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Add item to cart (Server Action)
 */
export async function addToCart(
  productId: string,
  name: string,
  price: number,
  image: string,
  quantity: number = 1,
  categoryId?: string
) {
  try {
    const cart = await getCart();

    // Check if item already exists
    const existingItemIndex = cart.findIndex((item) => item.productId === productId);

    if (existingItemIndex > -1) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        productId,
        name,
        price,
        image,
        quantity,
        categoryId,
      });
    }

    await saveCart(cart);
    revalidatePath("/");

    return { success: true, message: "Added to cart" };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: "Failed to add to cart" };
  }
}

/**
 * Remove item from cart (Server Action)
 */
export async function removeFromCart(productId: string) {
  try {
    const cart = await getCart();
    const updatedCart = cart.filter((item) => item.productId !== productId);

    await saveCart(updatedCart);
    revalidatePath("/cart");

    return { success: true, message: "Removed from cart" };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, message: "Failed to remove from cart" };
  }
}

/**
 * Update item quantity (Server Action)
 */
export async function updateCartQuantity(productId: string, quantity: number) {
  try {
    if (quantity < 1) {
      return removeFromCart(productId);
    }

    const cart = await getCart();
    const itemIndex = cart.findIndex((item) => item.productId === productId);

    if (itemIndex > -1) {
      cart[itemIndex].quantity = quantity;
      await saveCart(cart);
      revalidatePath("/cart");
      return { success: true, message: "Cart updated" };
    }

    return { success: false, message: "Item not found" };
  } catch (error) {
    console.error("Error updating cart:", error);
    return { success: false, message: "Failed to update cart" };
  }
}

/**
 * Get cart count (for badge)
 */
export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Get cart items (for cart page)
 */
export async function getCartItems(): Promise<CartItem[]> {
  return getCart();
}

/**
 * Clear cart (Server Action)
 */
export async function clearCart() {
  try {
    await saveCart([]);
    revalidatePath("/cart");
    return { success: true, message: "Cart cleared" };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, message: "Failed to clear cart" };
  }
}
