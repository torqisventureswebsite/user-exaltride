"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getWishlistItems, removeFromWishlist, clearWishlist, WishlistItem } from "@/lib/wishlist-actions";
import { useCart } from "@/lib/cart/context";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

export default function WishlistContent() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, updateQuantity, getItemQuantity } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    const wishlistItems = await getWishlistItems();
    setItems(wishlistItems);
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    const res = await removeFromWishlist(id);
    if (res.success) {
      setItems(items.filter((item) => item.id !== id));
      toast.success("Removed from wishlist");
    } else {
      toast.error("Failed to remove item");
    }
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
      const res = await clearWishlist();
      if (res.success) {
        setItems([]);
        toast.success("Wishlist cleared");
      } else {
        toast.error("Failed to clear wishlist");
      }
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      await addItem({
        productId: item.id,
        name: item.title,
        price: item.price,
        image: item.image,
        slug: item.slug,
      });
      toast.success("Added to cart!", {
        description: `${item.title} has been added to your cart`,
      });
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleIncrement = async (item: WishlistItem) => {
    const currentQty = getItemQuantity(item.id);
    await updateQuantity(item.id, currentQty + 1);
  };

  const handleDecrement = async (item: WishlistItem) => {
    const currentQty = getItemQuantity(item.id);
    await updateQuantity(item.id, currentQty - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="hidden md:block">
          <TopBar />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="aspect-square bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="hidden md:block">
          <TopBar />
        </div>
        <div className="container mx-auto px-4 py-16 flex-1">
          <div className="max-w-md mx-auto text-center">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Save your favorite items to your wishlist and shop them later!
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>
      <div className="container mx-auto px-4 py-8 flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-1">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
          >
            <Link href={`/products/${item.slug}`}>
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-4"
                />
                {item.in_stock === false && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600">
                  {item.title}
                </h3>
              </Link>
              
              {item.brand_name && (
                <p className="text-xs text-gray-500 mb-2">{item.brand_name}</p>
              )}

              <p className="text-lg font-bold text-gray-900 mb-3">
                ₹{item.price.toLocaleString()}
              </p>

              <div className="flex gap-2">
                {getItemQuantity(item.id) > 0 ? (
                  <div className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 rounded-md py-1">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="w-7 h-7 flex items-center justify-center text-gray-900 hover:bg-yellow-500 rounded transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-bold text-gray-900 min-w-[24px] text-center">
                      {getItemQuantity(item.id)}
                    </span>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="w-7 h-7 flex items-center justify-center text-gray-900 hover:bg-yellow-500 rounded transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                    onClick={() => handleAddToCart(item)}
                    disabled={item.in_stock === false}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(item.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline" className="px-8">
            Continue Shopping
          </Button>
        </Link>
      </div>
      </div>
      <Footer />
    </div>
  );
}
