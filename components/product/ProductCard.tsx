"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star, TruckIcon, Plus, Minus, Heart, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/context";
import { useCar } from "@/lib/car/context";
import { useState, useEffect, useMemo } from "react";
import { addToWishlist, removeFromWishlist, getWishlistItems } from "@/lib/wishlist-actions";
import { toast } from "sonner";

export interface CompatibleCar {
  id: string;
  make: string;
  model: string;
  year: number;
  variant?: string;
  notes?: string;
}

export interface ProductVendor {
  id: string;
  business_name: string;
  rating?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

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
  view_count?: number;
  brand_name?: string;
  status?: string;
  category_id?: string;
  category?: ProductCategory;
  sku?: string;
  warranty_months?: number;
  weight_kg?: number | null;
  dimensions_cm?: string | null;
  is_oem?: boolean;
  is_universal?: boolean;
  video_url?: string | null;
  return_policy?: string | null;
  shipping_info?: string | null;
  compatible_cars?: CompatibleCar[];
  vendor?: ProductVendor;
  created_at?: string;
  updated_at?: string;
  isCompatibleWithUserCar?: boolean;
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
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const { selectedCar } = useCar();
  const quantityInCart = getItemQuantity(product.id);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check if product is compatible with user's selected car
  const isCompatibleWithUserCar = useMemo(() => {
    // If explicitly set from parent, use that
    if (product.isCompatibleWithUserCar !== undefined) {
      return product.isCompatibleWithUserCar;
    }
    
    // Otherwise, check compatibility ourselves
    if (!selectedCar) return false;
    if (product.is_universal) return true;
    if (!product.compatible_cars || !Array.isArray(product.compatible_cars)) return false;
    
    return product.compatible_cars.some(car =>
      car.make.toLowerCase() === selectedCar.make.toLowerCase() &&
      car.model.toLowerCase() === selectedCar.model.toLowerCase() &&
      car.year === selectedCar.year
    );
  }, [selectedCar, product.compatible_cars, product.is_universal, product.isCompatibleWithUserCar]);

  // Check if product is in wishlist on mount
  useEffect(() => {
    async function checkWishlist() {
      const items = await getWishlistItems();
      setIsInWishlist(items.some((item) => item.id === product.id));
    }
    checkWishlist();
  }, [product.id]);

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

    try {
      addItem({
        productId: product.id,
        name: product.title || "",
        price: product.price || 0,
        image: product.primary_image || "/images/image1.jpg",
        categoryId: product.category_id,
        slug: product.slug,
      });
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantityInCart - 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent default touch behavior that causes scroll
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    if (wishlistLoading) return;
    
    // Optimistic update - update UI immediately
    const wasInWishlist = isInWishlist;
    setIsInWishlist(!wasInWishlist);
    setWishlistLoading(true);

    // Show toast immediately
    if (wasInWishlist) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist!");
    }

    // Sync with server in background
    const syncWithServer = async () => {
      try {
        if (wasInWishlist) {
          const result = await removeFromWishlist(product.id);
          if (!result.success) {
            // Revert on failure
            setIsInWishlist(true);
            toast.error("Failed to remove from wishlist");
          }
        } else {
          const result = await addToWishlist(
            product.id,
            product.title || "",
            product.price || 0,
            product.primary_image || "/images/image1.jpg",
            product.slug || "",
            product.brand_name,
            true
          );
          if (!result.success && result.message !== "Item already in wishlist") {
            // Revert on failure
            setIsInWishlist(false);
            toast.error("Failed to add to wishlist");
          }
        }
      } catch (error) {
        // Revert on error
        setIsInWishlist(wasInWishlist);
        toast.error("Failed to update wishlist");
      } finally {
        setWishlistLoading(false);
      }
    };

    syncWithServer();
  };

  return (
    <Link href={`/products/${product.slug || ""}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-xl !p-0 !gap-0">
        <div className="relative aspect-square overflow-hidden">
          {/* Product Image */}
          <Image
            src={product.primary_image || "/images/image1.jpg"}
            alt={product.title || "Product"}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          {/* Compatible with user's car indicator */}
          {isCompatibleWithUserCar && (
            <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-green-500 text-white p-1 md:p-1.5 rounded-full shadow-md" title="Fits your car">
              <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
            </div>
          )}

          {/* Discount Badge */}
          {discountAmount > 0 && (
            <Badge className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-yellow-500 px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-gray-900">
              {discountAmount}% off
            </Badge>
          )}

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            disabled={wishlistLoading}
            className={`absolute bottom-2 md:bottom-3 right-2 md:right-3 p-1.5 md:p-2 rounded-full shadow-md transition-all duration-200 ${
              isInWishlist 
                ? "bg-red-500 text-white" 
                : "bg-white text-gray-600 hover:text-red-500"
            } ${wishlistLoading ? "opacity-50" : "hover:scale-110"}`}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`h-4 w-4 md:h-5 md:w-5 ${isInWishlist ? "fill-current" : ""}`} 
            />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-2 md:p-4">
          {/* Product Title */}
          <h3 className="mb-1 line-clamp-2 h-8 text-xs md:text-sm font-medium text-gray-900">
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

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-1 md:gap-2">
            {quantityInCart > 0 ? (
              <div className="flex-1 flex items-center justify-center gap-2 bg-[#FFC107] rounded-md h-7 md:h-9">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-900 hover:bg-yellow-600 rounded-l-md transition-colors"
                >
                  <Minus className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <span className="text-xs md:text-sm font-bold text-gray-900 min-w-[20px] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrement}
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
              >
                <ShoppingCart className="mr-0.5 md:mr-1 h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Add to cart</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}
            <Button size="sm" className="flex-1 bg-[#001F5F] hover:bg-blue-700 text-[10px] md:text-sm px-1 md:px-3 py-1 md:py-2 h-7 md:h-9">
              <span className="hidden sm:inline">Buy Now</span>
              <span className="sm:hidden">Buy</span>
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
