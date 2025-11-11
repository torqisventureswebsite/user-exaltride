"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star, TruckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Product {
  id: string;
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  compare_at_price?: number | null;
  discount_percentage?: number | null;
  stock?: number;
  primary_image?: string;
  images?: string[];
  rating?: number;
  review_count?: number;
  brand_name?: string;
  status?: string;
  category_id?: string;
}

interface ProductCardProps {
  product: Product;
  badges?: {
    primary?: string; // e.g., "Bestseller", "Top Rated", "Hot Deal", "New Launch"
    secondary?: string; // e.g., "Limited Deal", "Deal of Day", "Trending", "Popular"
  };
  showOffers?: boolean;
}

const badgeStyles: Record<string, string> = {
  Bestseller: "bg-blue-600 text-white",
  "Top Rated": "bg-emerald-600 text-white",
  "Hot Deal": "bg-blue-700 text-white",
  "New Launch": "bg-blue-900 text-white",
  "Limited Deal": "bg-yellow-500 text-gray-900",
  "Deal of Day": "bg-yellow-500 text-gray-900",
  Trending: "bg-yellow-500 text-gray-900",
  Popular: "bg-yellow-500 text-gray-900",
};

export function ProductCard({
  product,
  badges = {},
  showOffers = true,
}: ProductCardProps) {
  const discountAmount =
    product.compare_at_price && product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic
    console.log("Add to cart:", product.id);
  };

  return (
    <Link href={`/products/${product.slug || ""}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden">
          {/* Product Image */}
          <Image
            src="/images/image1.jpg"
            alt={product.title || "Product"}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {badges.primary && (
              <Badge
                className={`${badgeStyles[badges.primary] || "bg-blue-600 text-white"} px-2 py-1 text-xs font-semibold`}
              >
                {badges.primary}
              </Badge>
            )}
            {badges.secondary && (
              <Badge
                className={`${badgeStyles[badges.secondary] || "bg-yellow-500 text-gray-900"} px-2 py-1 text-xs font-semibold`}
              >
                {badges.secondary}
              </Badge>
            )}
          </div>

          {/* Discount Badge */}
          {discountAmount > 0 && (
            <Badge className="absolute bottom-3 left-3 bg-yellow-500 px-2 py-1 text-xs font-bold text-gray-900">
              {discountAmount}% off
            </Badge>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Product Title */}
          <h3 className="mb-2 line-clamp-2 h-12 text-sm font-medium text-gray-900">
            {product.title || "Product"}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded bg-blue-600 px-2 py-0.5">
                <span className="text-xs font-semibold text-white">
                  {product.rating.toFixed(1)}
                </span>
                <Star className="h-3 w-3 fill-white text-white" />
              </div>
              <span className="text-xs text-gray-600">
                ({(product.review_count || 0).toLocaleString()})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{(product.price || 0).toLocaleString()}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.compare_at_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Free Delivery Badge */}
          <div className="mb-3 flex items-center gap-1.5 text-xs text-blue-600">
            <TruckIcon className="h-3.5 w-3.5" />
            <span className="font-medium">FREE Delivery</span>
          </div>

          {/* Offer Tags */}
          {showOffers && (
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs font-normal">
                Today Offer
              </Badge>
              <Badge variant="outline" className="text-xs font-normal">
                Bank Offers
              </Badge>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Add to cart
            </Button>
            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Buy Now
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
