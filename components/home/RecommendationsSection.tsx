"use client";

import { RecommendationCard } from "@/components/product/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ShoppingCart, ArrowRight, Loader2, Car, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/components/product/ProductCard";
import { useCarProducts, type CarProduct } from "@/lib/hooks/useCarProducts";
import { useCart } from "@/lib/cart/context";
import { useTransition } from "react";
import { toast } from "sonner";

interface RecommendationsSectionProps {
  products: Product[];
}

export function RecommendationsSection({ products: initialProducts }: RecommendationsSectionProps) {
  const { products, isLoading, hasCarFilter } = useCarProducts({
    endpoint: "products/best-rated",
    limit: 12,
    initialProducts: initialProducts as CarProduct[],
  });
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const [isPending, startTransition] = useTransition();

  const allProducts = products;
  
  // Return null if no products available
  if (!allProducts || allProducts.length === 0) {
    return null;
  }
  
  // Get featured product (highest rated)
  const featuredProduct = allProducts.reduce((prev, current) => {
    return (current.rating || 0) > (prev.rating || 0) ? current : prev;
  });

  // Get top 3 other highly rated products
  const recommendedProducts = allProducts
    .filter((p) => p.id !== featuredProduct.id)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const featuredQuantityInCart = getItemQuantity(featuredProduct.id);

  const handleFeaturedAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      try {
        await addItem({
          productId: featuredProduct.id,
          name: featuredProduct.title || "",
          price: featuredProduct.price || 0,
          image: featuredProduct.primary_image || "/images/image1.jpg",
          categoryId: featuredProduct.category_id,
          slug: featuredProduct.slug,
        });
        toast.success("Added to cart!", {
          description: `${featuredProduct.title} has been added to your cart`,
        });
      } catch (error) {
        toast.error("Failed to add to cart");
      }
    });
  };

  const handleFeaturedIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await updateQuantity(featuredProduct.id, featuredQuantityInCart + 1);
    });
  };

  const handleFeaturedDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await updateQuantity(featuredProduct.id, featuredQuantityInCart - 1);
    });
  };

  return (
    <section className="bg-gradient-to-br from-[#001F5F] to-[#003580] py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-yellow-400 p-2 md:p-3 rounded-xl flex-shrink-0">
              <Award className="h-6 w-6 md:h-8 md:w-8 text-blue-900" />
            </div>
            <div>
              <h2 className="text-lg md:text-3xl font-bold text-white">Expert Recommendations</h2>
              <p className="text-blue-100 text-xs md:text-sm mt-1">
                {hasCarFilter ? "Recommended for your car" : "Curated by Industry Professionals"}
              </p>
            </div>
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-white/60" />
            )}
            {hasCarFilter && !isLoading && (
              <span className="flex items-center gap-1 px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                <Car className="h-3 w-3" />
                Filtered
              </span>
            )}
          </div>
          <Link
            href={"/collections/recommendations" as any}
            className="flex items-center gap-1 text-white hover:text-yellow-400 font-medium text-sm md:text-base"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Product - Left Side */}
          <div className="bg-white rounded-2xl p-5 shadow-xl flex flex-col">
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 text-xs">
                ⭐ Featured Pick
              </Badge>
              <Badge className="bg-[#001F5F] text-white hover:bg-blue-700 text-xs">
                Expert Review
              </Badge>
            </div>

            {/* Product Image */}
            <div className="relative h-40 md:h-48 mb-3 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={featuredProduct.primary_image || "/images/image1.jpg"}
                alt={featuredProduct.title || "Featured Product"}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
              {featuredProduct.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {featuredProduct.description || "Complete emergency roadside assistance kit"}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-[#001F5F]">
                ₹{featuredProduct.price?.toLocaleString()}
              </span>
              {featuredProduct.compare_at_price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{featuredProduct.compare_at_price.toLocaleString()}
                  </span>
                  <Badge className="bg-yellow-500 text-BLACK text-xs">
                    {featuredProduct.discount_percentage?.toFixed(0)}% OFF
                  </Badge>
                </>
              )}
            </div>

            <p className="text-xs text-orange-600 font-semibold mb-3">Limited Time Offer</p>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              {featuredQuantityInCart > 0 ? (
                <div className="flex-1 flex items-center justify-center gap-3 bg-[#FFC107] rounded-md h-10">
                  <button
                    onClick={handleFeaturedDecrement}
                    disabled={isPending}
                    className="w-8 h-8 flex items-center justify-center text-gray-900 hover:bg-yellow-600 rounded transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-gray-900 min-w-[24px] text-center">
                    {featuredQuantityInCart}
                  </span>
                  <button
                    onClick={handleFeaturedIncrement}
                    disabled={isPending}
                    className="w-8 h-8 flex items-center justify-center text-gray-900 hover:bg-yellow-600 rounded transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Button 
                  className="flex-1 bg-[#FFC107] hover:bg-[#FFB300] text-gray-900 font-semibold gap-2 h-10"
                  onClick={handleFeaturedAddToCart}
                  disabled={isPending}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </Button>
              )}
              <Link href={`/products/${featuredProduct.slug}`} className="flex-1">
                <Button className="w-full bg-[#001F5F] hover:bg-blue-700 text-white font-semibold h-10">
                  Buy Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Recommendation Cards - Right Side */}
          <div className="flex flex-col gap-3">
            {recommendedProducts.map((product) => (
              <RecommendationCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
