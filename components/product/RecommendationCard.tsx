"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { addToCart } from "@/lib/cart-actions";
import { toast } from "sonner";
import type { Product } from "@/components/product/ProductCard";

interface RecommendationCardProps {
  product: Product;
}

export function RecommendationCard({ product }: RecommendationCardProps) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const res = await addToCart(
        product.id,
        product.title || "",
        product.price || 0,
        product.primary_image || "/images/image1.jpg",
        1,
        product.category_id
      );
      if (res.success) {
        setAdded(true);
        toast.success("Added to cart!");
        setTimeout(() => setAdded(false), 1500);
      } else {
        toast.error("Failed to add to cart");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex-1">
      <div className="flex gap-4 h-full">
        {/* Product Image */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.primary_image || "/images/image1.jpg"}
            alt={product.title || "Product"}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
              {product.title}
            </h3>
            <button className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
              <Heart className="h-4 w-4" />
            </button>
          </div>

          {/* Reviewer Info */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
              {product.brand_name?.charAt(0) || "E"}
            </div>
            <span className="text-[10px] text-gray-600 font-medium">Expert Review</span>
            <div className="flex items-center gap-0.5 bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">
              {product.rating?.toFixed(1) || "4.5"}
              <Star className="h-2.5 w-2.5 fill-current" />
            </div>
          </div>

          {/* Price */}
          <div className="mb-2">
            <span className="text-base font-bold text-[#001F5F]">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.compare_at_price && (
              <span className="ml-2 text-xs text-gray-400 line-through">
                ₹{product.compare_at_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 mt-auto">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isPending}
              className={`flex-1 text-xs h-8 ${
                added
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              } font-semibold`}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {added ? "Added!" : "Add"}
            </Button>
            <Link href={`/products/${product.slug}`} className="flex-1">
              <Button
                size="sm"
                className="w-full bg-[#001F5F] hover:bg-blue-700 text-white font-semibold text-xs h-8"
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
