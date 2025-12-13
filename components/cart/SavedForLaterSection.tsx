"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { getSavedItems, removeFromSaved, SavedItem } from "@/lib/saved-for-later";
import { toast } from "sonner";

export default function SavedForLaterSection() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    setSavedItems(getSavedItems());
  }, []);

  const handleMoveToCart = (item: SavedItem) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      categoryId: item.categoryId,
      slug: item.slug,
    });
    removeFromSaved(item.productId);
    setSavedItems((prev) => prev.filter((i) => i.productId !== item.productId));
    toast.success("Moved to cart!");
  };

  const handleRemove = (productId: string) => {
    removeFromSaved(productId);
    setSavedItems((prev) => prev.filter((i) => i.productId !== productId));
    toast.success("Removed from saved items");
  };

  if (savedItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
        Saved for Later ({savedItems.length})
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {savedItems.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <Link href={`/products/${item.slug || item.productId}`}>
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={item.image || "/images/image1.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
            </Link>

            <div className="p-3">
              <Link href={`/products/${item.slug || item.productId}`}>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors mb-2">
                  {item.name}
                </h3>
              </Link>

              <p className="text-lg font-bold text-[#001F5F] mb-3">
                ₹{item.price.toLocaleString()}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-[#FBC84C] text-[#001F5F] rounded-lg text-xs font-semibold hover:bg-yellow-500 transition-colors"
                >
                  <ShoppingCart size={14} />
                  <span className="hidden sm:inline">Move to Cart</span>
                  <span className="sm:hidden">Add</span>
                </button>

                <button
                  onClick={() => handleRemove(item.productId)}
                  className="p-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
