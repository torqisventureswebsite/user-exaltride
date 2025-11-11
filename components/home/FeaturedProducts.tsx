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
    <section className="border-t bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-sm text-gray-600">Handpicked selection</p>
          </div>

          <div className="flex gap-3">
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700">
                View all
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map(({ product, badges }) => (
            <ProductCard
              key={product.id}
              product={product}
              badges={badges}
              showOffers
            />
          ))}
        </div>
      </div>
    </section>
  );
}
