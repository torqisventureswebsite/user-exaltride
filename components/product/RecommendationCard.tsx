"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/components/product/ProductCard";

interface RecommendationCardProps {
  product: Product;
}

export function RecommendationCard({ product }: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src="/images/image1.jpg"
            alt={product.title || "Product"}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
              {product.title}
            </h3>
            <button className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Reviewer Info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {product.brand_name?.charAt(0) || "E"}
            </div>
            <span className="text-xs text-gray-600 font-medium">Expert Review</span>
            <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
              {product.rating?.toFixed(1) || "4.5"}
              <Star className="h-3 w-3 fill-current" />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {product.description || "Premium quality product with excellent features."}
          </p>

          {/* Price and Button */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-blue-600">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.compare_at_price && (
                <span className="ml-2 text-xs text-gray-400 line-through">
                  ₹{product.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>
            <Link href={`/products/${product.slug}`}>
              <Button
                size="sm"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-xs px-4"
              >
                View Deal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
