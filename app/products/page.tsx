import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { LayoutGrid, Filter, SlidersHorizontal } from "lucide-react";
import productsData from "@/data/products.json";
import type { Product } from "@/components/product/ProductCard";

const allProducts = productsData as Product[];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TopBar />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="mt-2 text-gray-600">
            Browse our complete collection of car parts and accessories
          </p>
        </div>

        {/* Filters and Sort Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Category
            </Button>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Price Range
            </Button>
            <Button variant="outline" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Brand
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {allProducts.length} products
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allProducts.map((product, index) => {
            // Assign different badges based on product characteristics
            let badges = {};
            
            if (index === 0) {
              badges = { primary: "Bestseller", secondary: "Limited Deal" };
            } else if (index === 1) {
              badges = { primary: "Hot Deal", secondary: "Trending" };
            } else if (index === 2) {
              badges = { primary: "New Launch", secondary: "Popular" };
            } else if (index === 3) {
              badges = { primary: "Top Rated", secondary: "Deal of Day" };
            }

            return (
              <ProductCard
                key={product.id}
                product={product}
                badges={badges}
                showOffers
              />
            );
          })}
        </div>

        {/* Load More or Pagination */}
        <div className="mt-12 flex justify-center">
          <Button size="lg" variant="outline">
            Load More Products
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
