"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import productsData from "@/data/products.json";
import type { Product } from "@/components/product/ProductCard";

const trendingProducts = productsData.slice(0, 4) as Product[];

export function TrendingSection() {
  return (
    <section className="bg-gray-50 py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl md:text-3xl">🔥</span>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900">Trending This Week</h2>
          </div>
          <p className="text-xs md:text-sm text-gray-600">Hot picks that car enthusiasts are loving right now</p>
        </div>

        {/* Products Grid - Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto pb-4 md:overflow-visible">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {trendingProducts.map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-[165px] md:w-auto relative">
                <ProductCard
                  product={product}
                  showOffers
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 md:mt-8 flex flex-col items-center gap-4">
          <Link href="/products?type=trending">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
              View All Trending
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
