"use client";

import { useState } from "react";
import { Heart, Trash2, ShoppingCart, Loader2, Package } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useWishlist } from "@/lib/wishlist/context";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export function MyWishlist() {
  const { addItem } = useCart();
  const { items: wishlistItems, isLoading, removeItem } = useWishlist();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemovingId(productId);
      await removeItem(productId);
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (item: typeof wishlistItems[0]) => {
    try {
      setAddingToCartId(item.productId);
      addItem({
        productId: item.productId,
        name: item.title || "Product",
        price: item.price || 0,
        image: item.image || "",
        slug: item.slug,
      });
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCartId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#001F5F] mb-4" />
          <p className="text-gray-500">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 text-center mb-6">
            Save items you love by clicking the heart icon on products
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 bg-[#001F5F] hover:bg-[#001845] text-white font-medium rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            My Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item.productId}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <Link href={`/products/${item.slug || item.productId}`}>
                <div className="relative aspect-square bg-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image || ""}
                      alt={item.title || "Product"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${item.slug || item.productId}`}>
                  <h4 className="font-medium text-gray-900 line-clamp-2 hover:text-[#001F5F] transition-colors">
                    {item.title || "Product"}
                  </h4>
                </Link>
                
                {item.brand_name && (
                  <p className="text-sm text-gray-500 mt-1">{item.brand_name}</p>
                )}

                {item.price !== undefined && (
                  <p className="text-lg font-bold text-[#001F5F] mt-2">
                    ₹{item.price.toLocaleString()}
                  </p>
                )}

                {item.in_stock === false && (
                  <p className="text-sm text-red-500 mt-1">Out of stock</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={addingToCartId === item.productId || item.in_stock === false}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FBC84C] hover:bg-yellow-500 text-[#001F5F] font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCartId === item.productId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                    <span className="text-sm">Add to Cart</span>
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    disabled={removingId === item.productId}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    {removingId === item.productId ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
