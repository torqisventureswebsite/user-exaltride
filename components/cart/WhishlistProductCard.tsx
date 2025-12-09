"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { addToCart } from "@/lib/cart-actions";
import { useState, useTransition } from "react";
import type { Product } from "../product/ProductCard";

interface WishlistProductCardProps {
  product: Product;
}

export function NewProductCard({ product }: WishlistProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.id || !product.title || !product.price) {
      console.error("Missing required product fields");
      return;
    }

    const productData = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.primary_image || "/images/image1.jpg",
      categoryId: product.category_id,
    };

    startTransition(async () => {
      try {
        const result = await addToCart(
          productData.id,
          productData.title,
          productData.price,
          productData.image,
          1,
          productData.categoryId
        );

        if (result.success) {
          setIsAdded(true);
          setTimeout(() => setIsAdded(false), 2000);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full">
      {/* ✅ IMAGE */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.primary_image || "/images/image1.jpg"}
          alt={product.title || "Product"}
          fill
          className="object-cover"
        />
      </div>

      {/* ✅ CONTENT */}
      <div className="p-3">
        {/* TITLE */}
        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1 min-h-[32px]">
          {product.title}
        </h3>

        {/* ✅ RATING */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center gap-0.5 bg-yellow-500 px-1.5 py-0.5 rounded">
              <Star className="h-3 w-3 fill-white text-white" />
              <span className="text-[10px] font-semibold text-white">
                {product.rating.toFixed(1)}
              </span>
            </div>
            {product.review_count && (
              <span className="text-[10px] text-gray-500">
                ({product.review_count})
              </span>
            )}
          </div>
        )}

        {/* ✅ PRICE */}
        <div className="mb-2 flex items-baseline gap-1">
          <span className="text-sm font-bold text-gray-900">
            ₹{product.price?.toLocaleString()}
          </span>
          {product.compare_at_price && (
            <span className="text-[10px] text-gray-500 line-through">
              ₹{product.compare_at_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* ✅ SINGLE ADD TO CART BUTTON (FULL WIDTH) */}
        <button
          onClick={handleAddToCart}
          disabled={isPending}
          className={`w-full flex items-center justify-center gap-2 rounded-md text-xs font-semibold py-2 transition
            ${
              isAdded
                ? "bg-yellow-500 text-white"
                : "bg-[#FBC84C] hover:bg-[#F5B800] text-black"
            }
          `}
        >
          <ShoppingCart className="h-4 w-4" />
          {isPending ? "Adding..." : isAdded ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
