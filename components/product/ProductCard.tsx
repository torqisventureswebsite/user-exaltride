"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star, TruckIcon, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/context";
import { useTransition } from "react";

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
  sku?: string;
  warranty_months?: number;
  weight_kg?: number;
  dimensions_cm?: string;
  is_oem?: boolean;
  is_universal?: boolean;
  created_at?: string;
  updated_at?: string;
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
  const [isPending, startTransition] = useTransition();
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const discountAmount =
    product.compare_at_price && product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : 0;

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
          <div className="absolute left-2 md:left-3 top-2 md:top-3 flex flex-col gap-1 md:gap-2">
            {badges.primary && (
              <Badge
                className={`${badgeStyles[badges.primary] || "bg-blue-600 text-white"} px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold`}
              >
                {badges.primary}
              </Badge>
            )}
            {badges.secondary && (
              <Badge
                className={`${badgeStyles[badges.secondary] || "bg-yellow-500 text-gray-900"} px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold`}
              >
                {badges.secondary}
              </Badge>
            )}
          </div>

          {/* Discount Badge */}
          {discountAmount > 0 && (
            <Badge className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-yellow-500 px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-gray-900">
              {discountAmount}% off
            </Badge>
          )}
        </div>

        {/* Card Content */}
        <div className="p-2 md:p-4">
          {/* Product Title */}
          <h3 className="mb-1 md:mb-2 line-clamp-2 h-8 md:h-12 text-xs md:text-sm font-medium text-gray-900">
            {product.title || "Product"}
          </h3>

          {/* Rating */}
          {/* {product.rating && product.rating > 0 && (
            <div className="mb-2 md:mb-3 flex items-center gap-1 md:gap-2">
              <div className="flex items-center gap-0.5 md:gap-1 rounded bg-blue-600 px-1 md:px-2 py-0.5">
                <span className="text-[10px] md:text-xs font-semibold text-white">
                  {product.rating.toFixed(1)}
                </span>
                <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-white text-white" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-600">
                ({(product.review_count || 0).toLocaleString()})
              </span>
            </div>
          )} */}

          {/* Price */}
          <div className="mb-1 md:mb-2 flex items-baseline gap-1 md:gap-2">
            <span className="text-sm md:text-xl font-bold text-gray-900">
              ₹{(product.price || 0).toLocaleString()}
            </span>
            {product.compare_at_price && (
              <span className="text-[10px] md:text-sm text-gray-500 line-through">
                ₹{product.compare_at_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Free Delivery Badge */}
          <div className="mb-2 md:mb-3 flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-blue-600">
            <TruckIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span className="font-medium">FREE Delivery</span>
          </div>

          {/* Offer Tags */}
          {showOffers && (
            <div className="mb-2 md:mb-3 flex flex-wrap gap-1 md:gap-2">
              <Badge variant="outline" className="text-[9px] md:text-xs font-normal px-1 md:px-2 py-0 md:py-0.5">
                Today Offer
              </Badge>
              <Badge variant="outline" className="text-[9px] md:text-xs font-normal px-1 md:px-2 py-0 md:py-0.5">
                Bank Offers
              </Badge>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-1 md:gap-2">
            {quantityInCart > 0 ? (
              <div className="flex-1 flex items-center justify-center gap-2 bg-[#FFC107] rounded-md h-7 md:h-9">
                <button
                  onClick={handleDecrement}
                  disabled={isPending}
                  className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-900 hover:bg-yellow-600 rounded-l-md transition-colors"
                >
                  <Minus className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <span className="text-xs md:text-sm font-bold text-gray-900 min-w-[20px] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={isPending}
                  className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-900 hover:bg-yellow-600 rounded-r-md transition-colors"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                className="flex-1 text-[10px] md:text-sm px-1 md:px-3 py-1 md:py-2 h-7 md:h-9 font-semibold transition-colors bg-[#FFC107] hover:bg-[#FFB300] text-gray-900"
                onClick={handleAddToCart}
                disabled={isPending}
              >
                <ShoppingCart className="mr-0.5 md:mr-1 h-3 w-3 md:h-4 md:w-4" />
                {isPending ? (
                  <span className="hidden sm:inline">Adding...</span>
                ) : (
                  <>
                    <span className="hidden sm:inline">Add to cart</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </Button>
            )}
            <Button size="sm" className="flex-1 bg-[#001F5F] hover:bg-blue-700 text-[10px] md:text-sm px-1 md:px-3 py-1 md:py-2 h-7 md:h-9">
              Buy Now
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
