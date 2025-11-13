import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import productsData from "@/data/products.json";
import type { Product } from "@/components/product/ProductCard";

const featuredProducts = [
  {
    product: productsData[0] as Product,
    badges: { primary: "Bestseller", secondary: "Limited Deal" },
  },
  {
    product: productsData[3] as Product,
    badges: { primary: "Top Rated", secondary: "Deal of Day" },
  },
  {
    product: productsData[1] as Product,
    badges: { primary: "Hot Deal", secondary: "Trending" },
  },
  {
    product: productsData[2] as Product,
    badges: { primary: "New Launch", secondary: "Popular" },
  },
];

export function FeaturedProducts() {
  return (
    <section className="border-t bg-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-xs md:text-sm text-gray-600">Handpicked selection</p>
          </div>

          <Link href="/products" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Products Grid - Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:overflow-visible">
          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {featuredProducts.map(({ product, badges }) => (
              <div key={product.id} className="flex-shrink-0 w-[165px] md:w-auto">
                <ProductCard
                  product={product}
                  badges={badges}
                  showOffers
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
