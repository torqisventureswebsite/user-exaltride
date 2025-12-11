"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { X, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { Product } from "@/lib/api/products";
import { fetchCategories, type Category } from "@/lib/api/categories";
import { fetchBrands } from "@/lib/api/brands";

interface CollectionPageClientProps {
  products: Product[];
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor?: string;
}

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  product_count?: number;
}

export default function CollectionPageClient({
  products: initialProducts,
  title,
  description,
  icon,
  iconBgColor = "bg-[#001F5F]",
}: CollectionPageClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    brand: true,
  });

  // API data
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allBrands, setAllBrands] = useState<BrandItem[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const itemsPerPage = 12;

  // Fetch categories and brands from API
  useEffect(() => {
    async function loadFilterData() {
      try {
        const [categories, brands] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
        ]);
        setAllCategories(categories.filter((c) => c.level === 0));
        setAllBrands(brands);
      } catch (error) {
        console.error("Error loading filter data:", error);
      } finally {
        setLoadingFilters(false);
      }
    }
    loadFilterData();
  }, []);

  const toggleFilterSection = (section: string) => {
    setExpandedFilters((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Get unique brands from products as fallback
  const productBrands = useMemo(() => {
    const brandSet = new Set(
      initialProducts.map((p) => p.brand_name).filter(Boolean)
    );
    return Array.from(brandSet).sort();
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category?.id || p.category_id || "")
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
      case "discount":
        filtered.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [initialProducts, selectedCategories, selectedBrands, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, priceRange, sortBy]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange("all");
    setSortBy("featured");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange !== "all";
  
  // Use API brands if available, otherwise use brands from products
  const displayBrands: BrandItem[] = allBrands.length > 0 
    ? allBrands 
    : productBrands.map(name => ({ id: name, name, slug: name.toLowerCase().replace(/\s+/g, '-'), product_count: undefined }));

  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 mb-20 md:mb-0">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center gap-4">
          <div className={`${iconBgColor} p-3 rounded-xl`}>
            {icon}
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              {description} • {filteredProducts.length} products
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          {showFilters && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
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
                <div className="mb-4 border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleFilterSection("category")}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 py-2"
                  >
                    Category
                    {selectedCategories.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mr-2">
                        {selectedCategories.length}
                      </span>
                    )}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedFilters.category ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedFilters.category && (
                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                      {loadingFilters ? (
                        <p className="text-xs text-gray-500">Loading...</p>
                      ) : allCategories.length === 0 ? (
                        <p className="text-xs text-gray-500">No categories</p>
                      ) : (
                        allCategories.map((category) => (
                          <label key={category.id} className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category.id)}
                              onChange={() => toggleCategory(category.id)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{category.name}</span>
                            {category.item_count && (
                              <span className="text-xs text-gray-400">({category.item_count})</span>
                            )}
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="mb-4 border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleFilterSection("price")}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 py-2"
                  >
                    Price Range
                    {priceRange !== "all" && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mr-2">
                        1
                      </span>
                    )}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedFilters.price ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedFilters.price && (
                    <div className="space-y-2 mt-2">
                      {[
                        { value: "all", label: "All Prices" },
                        { value: "under-1000", label: "Under ₹1,000" },
                        { value: "1000-3000", label: "₹1,000 - ₹3,000" },
                        { value: "3000-5000", label: "₹3,000 - ₹5,000" },
                        { value: "above-5000", label: "Above ₹5,000" },
                      ].map((option) => (
                        <label key={option.value} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="price"
                            checked={priceRange === option.value}
                            onChange={() => setPriceRange(option.value)}
                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brand Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilterSection("brand")}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 py-2"
                  >
                    Brand
                    {selectedBrands.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mr-2">
                        {selectedBrands.length}
                      </span>
                    )}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedFilters.brand ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedFilters.brand && (
                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                      {loadingFilters ? (
                        <p className="text-xs text-gray-500">Loading...</p>
                      ) : displayBrands.length === 0 ? (
                        <p className="text-xs text-gray-500">No brands</p>
                      ) : (
                        displayBrands.map((brand) => (
                          <label key={brand.id} className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand.name)}
                              onChange={() => toggleBrand(brand.name)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{brand.name}</span>
                            {brand.product_count && (
                              <span className="text-xs text-gray-400">({brand.product_count})</span>
                            )}
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar - Desktop */}
            <div className="mb-6 hidden md:flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="hidden lg:flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>

                {/* Active Filter Badges */}
                {selectedCategories.map((catId) => {
                  const cat = allCategories.find((c) => c.id === catId);
                  return (
                    <Badge key={catId} variant="secondary" className="gap-1 px-2 py-1">
                      {cat?.name || catId}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(catId)} />
                    </Badge>
                  );
                })}
                {selectedBrands.map((brand) => (
                  <Badge key={brand} variant="secondary" className="gap-1 px-2 py-1">
                    {brand}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleBrand(brand)} />
                  </Badge>
                ))}
                {priceRange !== "all" && (
                  <Badge variant="secondary" className="gap-1 px-2 py-1">
                    {priceRange === "under-1000" && "Under ₹1,000"}
                    {priceRange === "1000-3000" && "₹1,000 - ₹3,000"}
                    {priceRange === "3000-5000" && "₹3,000 - ₹5,000"}
                    {priceRange === "above-5000" && "Above ₹5,000"}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange("all")} />
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{filteredProducts.length} products</span>
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
                    <option value="discount">Biggest Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Count - Mobile */}
            <div className="mb-4 md:hidden flex items-center justify-between">
              <span className="text-sm text-gray-600">{filteredProducts.length} products</span>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-blue-600">
                  Clear All
                </Button>
              )}
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showOffers />
                ))}
              </div>
            ) : (
              <Card className="p-8 md:p-12 text-center">
                <p className="text-sm md:text-base text-gray-600">No products found matching your filters.</p>
                <Button onClick={clearFilters} className="mt-4" variant="outline" size="sm">
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
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 md:h-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 md:gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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

      {/* Mobile Bottom Filter/Sort Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700"
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
            className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Filter Modal - Mobile */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilterModal(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-blue-600">
                    Clear All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowFilterModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Category */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {loadingFilters ? (
                    <p className="text-xs text-gray-500">Loading...</p>
                  ) : (
                    allCategories.map((category) => (
                      <label key={category.id} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Prices" },
                    { value: "under-1000", label: "Under ₹1,000" },
                    { value: "1000-3000", label: "₹1,000 - ₹3,000" },
                    { value: "3000-5000", label: "₹3,000 - ₹5,000" },
                    { value: "above-5000", label: "Above ₹5,000" },
                  ].map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="price-mobile"
                        checked={priceRange === option.value}
                        onChange={() => setPriceRange(option.value)}
                        className="h-4 w-4 border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {loadingFilters ? (
                    <p className="text-xs text-gray-500">Loading...</p>
                  ) : (
                    displayBrands.map((brand) => (
                      <label key={brand.id} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.name)}
                          onChange={() => toggleBrand(brand.name)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{brand.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <Button className="w-full bg-blue-600" onClick={() => setShowFilterModal(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Modal - Mobile */}
      {showSortModal && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSortModal(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Sort By</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowSortModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {[
                { value: "featured", label: "Featured" },
                { value: "price-low", label: "Price: Low to High" },
                { value: "price-high", label: "Price: High to Low" },
                { value: "rating", label: "Highest Rated" },
                { value: "discount", label: "Biggest Discount" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm ${
                    sortBy === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
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
