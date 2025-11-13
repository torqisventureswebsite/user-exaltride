"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import  TopBar  from "@/components/layout/TopBar";
import  Footer  from "@/components/layout/Footer";
import { X, ChevronDown, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import type { Product } from "@/components/product/ProductCard";

const allProducts = productsData as Product[];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const itemsPerPage = 10;

  // Handle URL category parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && !selectedCategories.includes(categoryParam)) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

  // Get unique brands
  const brands = useMemo(() => {
    const brandSet = new Set(
      allProducts.map((p) => p.brand_name).filter(Boolean)
    );
    return Array.from(brandSet).sort();
  }, []);

  // Get categories
  const categories = categoriesData.filter((c) => c.level === 0);

  const filteredProducts = useMemo(() => {
  let filtered = [...allProducts];

  // If "type=deals" is present, only show discounted products
  const viewType = searchParams.get("type");
  if (viewType === "deals") {
    filtered = filtered.filter(
      (p) => p.discount_percentage && p.discount_percentage > 0
    );
  }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category_id || "")
      );
    }

    // Filter by brand
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBrands.includes(p.brand_name || "")
      );
    }

    // Filter by price range
    if (priceRange !== "all") {
      filtered = filtered.filter((p) => {
        const price = p.price || 0;
        switch (priceRange) {
          case "under-1000":
            return price < 1000;
          case "1000-3000":
            return price >= 1000 && price < 3000;
          case "3000-5000":
            return price >= 3000 && price < 5000;
          case "above-5000":
            return price >= 5000;
          default:
            return true;
        }
      });
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
        );
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [selectedCategories, selectedBrands, priceRange, sortBy, searchParams]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, priceRange, sortBy]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange("all");
    setSortBy("featured");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange !== "all";

  return (
    <>
    <div className="min-h-screen bg-gray-50 pb-0 md:pb-0">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <main className="container mx-auto px-4 py-4 md:py-8 mb-20 md:mb-0">
        {/* Page Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">All Products</h1>
          <p className="mt-1 md:mt-2 text-xs md:text-base text-gray-600">
            Browse our complete collection of car parts and accessories
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Hidden on Mobile */}
          <aside
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <Card className="sticky top-4 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-blue-600"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Category
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Price Range
                </h3>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === "all"}
                      onChange={() => setPriceRange("all")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">All Prices</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === "under-1000"}
                      onChange={() => setPriceRange("under-1000")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Under ₹1,000</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === "1000-3000"}
                      onChange={() => setPriceRange("1000-3000")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      ₹1,000 - ₹3,000
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === "3000-5000"}
                      onChange={() => setPriceRange("3000-5000")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      ₹3,000 - ₹5,000
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === "above-5000"}
                      onChange={() => setPriceRange("above-5000")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Above ₹5,000</span>
                  </label>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Brand
                </h3>
                <div className="space-y-2">
                  {brands.map((brand) => {
                    if (!brand) return null;
                    return (
                      <label
                        key={brand}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            {/* Active Filters & Sort Bar - Desktop Only */}
            <div className="mb-6 hidden md:flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  {showFilters ? "Hide" : "Show"} Filters
                </Button>

                {/* Active Filter Badges */}
                {selectedCategories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return (
                    <Badge
                      key={catId}
                      variant="secondary"
                      className="gap-1 px-2 py-1"
                    >
                      {cat?.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => toggleCategory(catId)}
                      />
                    </Badge>
                  );
                })}
                {selectedBrands.map((brand) => (
                  <Badge
                    key={brand}
                    variant="secondary"
                    className="gap-1 px-2 py-1"
                  >
                    {brand}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleBrand(brand)}
                    />
                  </Badge>
                ))}
                {priceRange !== "all" && (
                  <Badge variant="secondary" className="gap-1 px-2 py-1">
                    {priceRange === "under-1000" && "Under ₹1,000"}
                    {priceRange === "1000-3000" && "₹1,000 - ₹3,000"}
                    {priceRange === "3000-5000" && "₹3,000 - ₹5,000"}
                    {priceRange === "above-5000" && "Above ₹5,000"}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRange("all")}
                    />
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} products
                </span>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Count - Mobile Only */}
            <div className="mb-4 md:hidden flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-blue-600"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-3">
                {paginatedProducts.map((product, index) => {
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
                    <div key={product.id} className="w-full">
                      <ProductCard
                        product={product}
                        badges={badges}
                        showOffers
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 md:p-12 text-center">
                <p className="text-sm md:text-base text-gray-600">
                  No products found matching your filters.
                </p>
                <Button
                  onClick={clearFilters}
                  className="mt-4"
                  variant="outline"
                  size="sm"
                >
                  Clear Filters
                </Button>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 md:mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 md:h-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1 md:gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first page, last page, current page and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 md:h-10 md:w-10 p-0 text-xs md:text-sm ${
                            currentPage === page ? "bg-blue-600" : ""
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 md:h-10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Hidden on Mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>

    {/* Mobile Bottom Filter/Sort Bar */}
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
        >
          <Filter className="h-4 w-4" />
          Filter
          {hasActiveFilters && (
            <Badge className="bg-blue-600 text-white px-1.5 py-0.5 text-xs rounded-full">
              {selectedCategories.length + selectedBrands.length + (priceRange !== "all" ? 1 : 0)}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setShowSortModal(true)}
          className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </button>
      </div>
    </div>

    {/* Filter Modal - Mobile */}
    {showFilterModal && (
      <div className="fixed inset-0 z-50 md:hidden">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowFilterModal(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-blue-600"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Price Range</h3>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price-mobile"
                    checked={priceRange === "all"}
                    onChange={() => setPriceRange("all")}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">All Prices</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price-mobile"
                    checked={priceRange === "under-1000"}
                    onChange={() => setPriceRange("under-1000")}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Under ₹1,000</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price-mobile"
                    checked={priceRange === "1000-3000"}
                    onChange={() => setPriceRange("1000-3000")}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">₹1,000 - ₹3,000</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price-mobile"
                    checked={priceRange === "3000-5000"}
                    onChange={() => setPriceRange("3000-5000")}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">₹3,000 - ₹5,000</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price-mobile"
                    checked={priceRange === "above-5000"}
                    onChange={() => setPriceRange("above-5000")}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Above ₹5,000</span>
                </label>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Brand</h3>
              <div className="space-y-2">
                {brands.map((brand) => {
                  if (!brand) return null;
                  return (
                    <label
                      key={brand}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <Button
              onClick={() => setShowFilterModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    )}

    {/* Sort Modal - Mobile */}
    {showSortModal && (
      <div className="fixed inset-0 z-50 md:hidden">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowSortModal(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Sort By</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSortModal(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 space-y-2">
            {[
              { value: "featured", label: "Featured" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "rating", label: "Highest Rated" },
              { value: "newest", label: "Newest" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setShowSortModal(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm ${
                  sortBy === option.value
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
