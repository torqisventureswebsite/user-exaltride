"use client";

import Image from "next/image";
import { ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useTransition } from "react";
import type { Product } from "../product/ProductCard";

interface WishlistProductCardProps {
  product: Product;
}

export function NewProductCard({ product }: WishlistProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.id || !product.title || !product.price) {
      console.error("Missing required product fields");
      return;
    }

    startTransition(async () => {
      try {
        await addItem({
          productId: product.id,
          name: product.title || "",
          price: product.price || 0,
          image: product.primary_image || "/images/image1.jpg",
          categoryId: product.category_id,
          slug: product.slug,
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await updateQuantity(product.id, quantityInCart + 1);
    });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await updateQuantity(product.id, quantityInCart - 1);
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

        {/* ✅ ADD TO CART / QUANTITY CONTROLS */}
        {quantityInCart > 0 ? (
          <div className="w-full flex items-center justify-center gap-3 bg-[#FBC84C] rounded-md py-1.5">
            <button
              onClick={handleDecrement}
              disabled={isPending}
              className="w-7 h-7 flex items-center justify-center text-black hover:bg-yellow-600 rounded transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-black min-w-[24px] text-center">
              {quantityInCart}
            </span>
            <button
              onClick={handleIncrement}
              disabled={isPending}
              className="w-7 h-7 flex items-center justify-center text-black hover:bg-yellow-600 rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-md text-xs font-semibold py-2 transition bg-[#FBC84C] hover:bg-[#F5B800] text-black"
          >
            <ShoppingCart className="h-4 w-4" />
            {isPending ? "Adding..." : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
