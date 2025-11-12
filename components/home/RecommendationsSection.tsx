"use client";

import { RecommendationCard } from "@/components/product/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import productsData from "@/data/products.json";
import type { Product } from "@/components/product/ProductCard";

export function RecommendationsSection() {
  const allProducts = productsData as Product[];
  
  // Get featured product (highest rated)
  const featuredProduct = allProducts.reduce((prev, current) => {
    return (current.rating || 0) > (prev.rating || 0) ? current : prev;
  });

  // Get top 3 other highly rated products
  const recommendedProducts = allProducts
    .filter((p) => p.id !== featuredProduct.id)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 p-3 rounded-xl">
              <Award className="h-8 w-8 text-blue-900" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Expert Recommendations</h2>
              <p className="text-blue-100 text-sm mt-1">Curated by Industry Professionals</p>
            </div>
          </div>
          <Link href="/products">
            <Button className="bg-white hover:bg-gray-100 text-blue-700 font-semibold gap-2">
              View All Picks
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Featured Product - Left Side */}
          <div className="bg-white rounded-2xl p-6 shadow-xl h-full flex flex-col">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                ⭐ Featured Pick
              </Badge>
              <Badge className="bg-red-500 text-white hover:bg-red-600">
                🔴 Expert Review
              </Badge>
            </div>

            {/* Product Image */}
            <div className="relative h-56 mb-4 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src="/images/image1.jpg"
                alt={featuredProduct.title || "Featured Product"}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info - Flex grow to fill space */}
            <div className="flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {featuredProduct.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {featuredProduct.description || "Complete emergency roadside assistance kit"}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-3xl font-bold text-blue-600">
                  ₹{featuredProduct.price?.toLocaleString()}
                </span>
                {featuredProduct.compare_at_price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{featuredProduct.compare_at_price.toLocaleString()}
                    </span>
                    <Badge className="bg-green-500 text-white">
                      {featuredProduct.discount_percentage?.toFixed(0)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <p className="text-sm text-orange-600 font-semibold mb-auto pb-4">Limited Time Offer</p>

              {/* Action Buttons - Pushed to bottom */}
              <div className="flex gap-3 mt-auto">
                <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </Button>
                <Link href={`/products/${featuredProduct.slug}`} className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Buy Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recommendation Cards - Right Side */}
          <div className="flex flex-col gap-4 h-full">
            {recommendedProducts.map((product) => (
              <RecommendationCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
