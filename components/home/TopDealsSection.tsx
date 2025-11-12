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
    <section id="deals" className="border-t bg-white py-12 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Top Deals</h2>
            <p className="text-sm text-gray-600">Exclusive discounts for you</p>
          </div>

          <div className="flex gap-3">
            <Link href="/products?type=deals">
              <Button className="bg-blue-600 hover:bg-blue-700">
                View all
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topDeals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
