"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  slug: string;
  title: string;
  primary_image: string;
  price: number;
  brand_name: string;
  rating: number;
  in_stock?: boolean;
  compare_at_price?: number;
  discount_percentage?: number;
  review_count?: number;
}

interface SearchResult {
  products: Product[];
  total: number;
  query: string;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=100`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults({ products: [], total: 0, query });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // Sort products based on selected option
  const sortedProducts = results?.products ? [...results.products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return 0; // Would need created_at field
      case "relevance":
      default:
        return 0; // Already sorted by relevance from API
    }
  }) : [];

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Search for Products</h1>
        <p className="text-gray-600">
          Enter a search term in the search bar above to find products
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="aspect-square bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          {results?.total || 0} {results?.total === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Filters and Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {showFilters && <span className="text-xs">(Hide)</span>}
        </Button>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Filter Panel (Optional - can be expanded) */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Availability
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">In Stock Only</span>
              </label>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Rating
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">4 Stars & Above</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any products matching "{query}"
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Try:</p>
            <ul className="list-disc list-inside">
              <li>Checking your spelling</li>
              <li>Using more general terms</li>
              <li>Searching by brand name</li>
              <li>Browsing our categories instead</li>
            </ul>
          </div>
        </div>
      )}

      {/* Pagination (if needed) */}
      {sortedProducts.length > 0 && results && results.total > sortedProducts.length && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline">Load More Products</Button>
        </div>
      )}
    </div>
  );
}
