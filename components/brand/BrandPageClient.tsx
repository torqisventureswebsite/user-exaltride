"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  Package,
  Home,
} from "lucide-react";
import { fetchCategories, type Category } from "@/lib/api/categories";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
}

interface BrandPageClientProps {
  brand: Brand;
  products: Product[];
}

export default function BrandPageClient({ brand, products }: BrandPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch all categories to get names
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await fetchCategories();
        setAllCategories(cats);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }
    loadCategories();
  }, []);

  // Get unique categories from products with names from API
  const categories = useMemo(() => {
    const catIds = new Set<string>();
    products.forEach((p) => {
      if (p.category_id) catIds.add(p.category_id);
    });
    
    // Map category IDs to names from fetched categories
    return Array.from(catIds).map((id) => {
      const cat = allCategories.find((c) => c.id === id);
      return { id, name: cat?.name || id };
    });
  }, [products, allCategories]);

  // Deduplicate products by ID
  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    return products.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...uniqueProducts];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
        );
        break;
    }

    return list;
  }, [uniqueProducts, selectedCategory, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sortBy]);

  // Badge assignments for products
  const getBadges = (index: number) => {
    const badgeTypes = [
      { primary: "Bestseller" },
      { primary: "Top Rated" },
      { primary: "Featured" },
      { primary: "Hot Deal" },
      { primary: "New Launch" },
      { primary: "Premium" },
    ];
    return badgeTypes[index % badgeTypes.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Top Bar */}
      <div className="bg-[#001F5F] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <Link href="/" className="text-white/80 hover:text-white text-sm flex items-center gap-1">
              <Home className="h-3 w-3" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-white/50" />
            <Link href="/products" className="text-white/80 hover:text-white text-sm">
              Brands
            </Link>
            <ChevronRight className="h-3 w-3 text-white/50" />
            <span className="text-yellow-400 text-sm font-medium">{brand.name} Official Store</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#001F5F] via-[#002d7a] to-[#001F5F] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        </div>
        
        {/* Large Brand Name Watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[200px] font-bold text-white/5 tracking-wider pointer-events-none hidden lg:block">
          {brand.name.toUpperCase()}
        </div>

        <div className="container mx-auto px-4 py-10 md:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              {/* Brand Logo & Badge */}
              <div className="flex items-center gap-4 mb-6">
                {brand.logo ? (
                  <div className="bg-white rounded-xl p-4 w-24 h-24 flex items-center justify-center shadow-lg">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-4 w-24 h-24 flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-[#001F5F]">{brand.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Transform Your Drive with
                <br />
                <span className="text-yellow-400">{brand.name} Innovation</span>
              </h1>

              <p className="text-white/80 text-base md:text-lg mb-6 max-w-lg">
                {brand.description || `Experience premium car audio, cutting-edge dash cameras, and intelligent accessories. Elevate every journey with ${brand.name}'s legendary sound quality and innovation.`}
              </p>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Product Image */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                  <Image
                    src="/images/image1.jpg"
                    alt={`${brand.name} Product`}
                    width={500}
                    height={350}
                    className="rounded-xl object-cover w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Bar */}
      <div className="bg-yellow-400">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 overflow-x-auto scrollbar-hide gap-6">
            
          </div>
        </div>
      </div>



      {/* Products Section */}
      <div id="products" className="container mx-auto px-4 py-8">
        <div className="flex md:items-center gap-5 flex-col md:flex-row md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    badges={getBadges(index)}
                    showOffers
                  />
                ))}
            </div>

            {/* Pagination */}
            {filteredProducts.length > itemsPerPage && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  variant="outline"
                  disabled={page === 1}
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: Math.ceil(filteredProducts.length / itemsPerPage) },
                    (_, i) => i + 1
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-[#001F5F] text-white"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(Math.ceil(filteredProducts.length / itemsPerPage), p + 1)
                    )
                  }
                  variant="outline"
                  disabled={page === Math.ceil(filteredProducts.length / itemsPerPage)}
                  size="sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products available for this brand</p>
          </div>
        )}
      </div>
    </div>
  );
}
