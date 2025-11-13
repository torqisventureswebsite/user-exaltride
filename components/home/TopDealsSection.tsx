"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import products from "@/data/products.json";

export function TopDealsSection() {
  // Filter products with a discount (to simulate “Top Deals”)
  const topDeals = products.filter(
    (p) => p.discount_percentage && p.discount_percentage > 0
  );

  return (
    <section id="deals" className="border-t bg-white py-8 md:py-12 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Top Deals</h2>
            <p className="text-xs md:text-sm text-gray-600">Exclusive discounts for you</p>
          </div>

          <Link href="/products?type=deals" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Product Grid - Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:overflow-visible">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {topDeals.slice(0, 4).map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[165px] md:w-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
