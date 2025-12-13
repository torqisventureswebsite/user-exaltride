"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  ShieldCheck, 
  LayoutGrid, 
  Tag, 
  ArrowRight,
  X,
  ArrowUpDown
} from "lucide-react";
import type { Product } from "@/lib/api/products";
import { fetchBrands } from "@/lib/api/brands";
import { fetchCategories, type Category } from "@/lib/api/categories";
import Link from "next/link";
import { useCar } from "@/lib/car/context";

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
  const { selectedCar } = useCar();

  // Helper to check if product is compatible with selected car
  const isProductCompatible = (product: Product): boolean => {
    if (!selectedCar) return false;
    if (product.is_universal) return true;
    if (!product.compatible_cars || !Array.isArray(product.compatible_cars)) return false;
    
    return product.compatible_cars.some(car =>
      car.make.toLowerCase() === selectedCar.make.toLowerCase() &&
      car.model.toLowerCase() === selectedCar.model.toLowerCase() &&
      car.year === selectedCar.year
    );
  };

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("price-high");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  
  // Dropdown states
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  // Price range state
  const priceRangeValues = useMemo(() => {
    const prices = initialProducts.map((p) => p.price || 0).filter(p => p > 0);
    const min = prices.length > 0 ? Math.min(...prices) : 0;
    const max = prices.length > 0 ? Math.max(...prices) : 10000;
    return [min, max] as [number, number];
  }, [initialProducts]);
  
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRangeValues);

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

  // Get unique brands from products as fallback
  const productBrands = useMemo(() => {
    const brandSet = new Set(
      initialProducts.map((p) => p.brand_name).filter(Boolean)
    );
    return Array.from(brandSet).sort();
  }, [initialProducts]);

  // Deduplicate products
  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    return initialProducts.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...uniqueProducts];

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
    filtered = filtered.filter((p) => {
      const price = p.price || 0;
      return price >= localPriceRange[0] && price <= localPriceRange[1];
    });

    // Sort products - compatible products first when car is selected
    if (selectedCar) {
      filtered.sort((a, b) => {
        const aCompatible = isProductCompatible(a);
        const bCompatible = isProductCompatible(b);
        if (aCompatible && !bCompatible) return -1;
        if (!aCompatible && bCompatible) return 1;
        return 0;
      });
    }

    // Then apply user's sort preference
    const stableSort = (arr: Product[], compareFn: (a: Product, b: Product) => number) => {
      return arr.map((item, index) => ({ item, index }))
        .sort((a, b) => compareFn(a.item, b.item) || a.index - b.index)
        .map(({ item }) => item);
    };

    switch (sortBy) {
      case "price-low":
        filtered = stableSort(filtered, (a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered = stableSort(filtered, (a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        filtered = stableSort(filtered, (a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "discount":
        filtered = stableSort(filtered, (a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [uniqueProducts, selectedCategories, selectedBrands, localPriceRange, sortBy, selectedCar]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, localPriceRange, sortBy]);

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
    setLocalPriceRange(priceRangeValues);
    setSortBy("price-high");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || 
    localPriceRange[0] !== priceRangeValues[0] || 
    localPriceRange[1] !== priceRangeValues[1];
  
  // Use API brands if available, otherwise use brands from products
  const displayBrands: BrandItem[] = allBrands.length > 0 
    ? allBrands 
    : productBrands.map(name => ({ id: name, name, slug: name.toLowerCase().replace(/\s+/g, '-'), product_count: undefined }));

  return (
    <>
      {/* Hero Section */}
      <div className="bg-[#001F5F] text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-xl md:text-3xl font-bold">{title}</h1>
        </div>
      </div>

      {/* Yellow Promo Banner */}
      <div className="w-full">
        <div
          className="relative h-[140px] md:h-[180px] w-full overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #FBC84C 0%, #FFD666 50%, #FBC84C 100%)",
          }}
        >
          <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-10">
            <div className="max-w-[65%] md:max-w-lg">
              <h2 className="text-lg md:text-2xl font-bold text-[#001F5F] mb-1 md:mb-2 leading-tight">
                Best Prices on Car Electronics
              </h2>
              <p className="text-xs md:text-base text-[#001F5F]/80 mb-2 md:mb-4">
                Top brands, unbeatable prices
              </p>
            </div>
            <div className="relative w-[70px] h-[70px] md:w-[120px] md:h-[120px] shrink-0 bg-[#001F5F]/10 rounded-xl md:rounded-2xl flex items-center justify-center">
              <Tag className="w-8 h-8 md:w-14 md:h-14 text-[#001F5F]" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 mb-20 md:mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-4">
              <Card className="p-0 overflow-hidden border rounded-xl shadow-sm">
                {/* Filter Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Filters</span>
                  </div>
                  {hasActiveFilters && (
                    <button 
                      onClick={clearFilters} 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white w-full text-gray-600 text-sm px-4 py-2 rounded-lg border border-black/20 focus:outline-none"
                >
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                </div>

                <div className="p-4 space-y-1">
                  {/* CATEGORIES DROPDOWN */}
                  <div className="overflow-hidden">
                    <button
                      onClick={() => setCategoriesOpen(!categoriesOpen)}
                      className="w-full flex items-center justify-between py-3 transition-colors"
                    >
                      <span className="text-sm font-medium">Categories</span>
                      {categoriesOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    {categoriesOpen && (
                      <div className="py-2 max-h-48 overflow-y-auto">
                        <div className="flex flex-col gap-2">
                          {loadingFilters ? (
                            <p className="text-xs text-gray-500">Loading...</p>
                          ) : allCategories.length === 0 ? (
                            <p className="text-xs text-gray-500">No categories</p>
                          ) : (
                            allCategories.map((cat) => (
                              <label key={cat.id} className="flex items-center gap-2 cursor-pointer py-1 hover:bg-gray-50 rounded px-1">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(cat.id)}
                                  onChange={() => toggleCategory(cat.id)}
                                  className="h-4 w-4 accent-[#001F5F] rounded"
                                />
                                <span className={`text-sm ${selectedCategories.includes(cat.id) ? 'font-medium text-[#001F5F]' : ''}`}>
                                  {cat.name}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BRANDS DROPDOWN */}
                  <div className="overflow-hidden border-t pt-2">
                    <button
                      onClick={() => setBrandsOpen(!brandsOpen)}
                      className="w-full flex items-center justify-between py-3 transition-colors"
                    >
                      <span className="text-sm font-medium">Brands</span>
                      {brandsOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    {brandsOpen && (
                      <div className="py-2 max-h-48 overflow-y-auto">
                        <div className="flex flex-col gap-2">
                          {loadingFilters ? (
                            <p className="text-xs text-gray-500">Loading...</p>
                          ) : (
                            displayBrands.slice(0, 10).map((b) => (
                              <label key={b.id} className="flex items-center gap-2 cursor-pointer py-1 hover:bg-gray-50 rounded px-1">
                                <input
                                  type="checkbox"
                                  checked={selectedBrands.includes(b.name)}
                                  onChange={() => toggleBrand(b.name)}
                                  className="h-4 w-4 accent-[#001F5F] rounded"
                                />
                                <span className={`text-sm ${selectedBrands.includes(b.name) ? 'font-medium text-[#001F5F]' : ''}`}>
                                  {b.name}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PRICE RANGE DROPDOWN */}
                  <div className="overflow-hidden border-t pt-2">
                    <button
                      onClick={() => setPriceOpen(!priceOpen)}
                      className="w-full flex items-center justify-between py-3 transition-colors"
                    >
                      <span className="text-sm font-medium">Price Range</span>
                      {priceOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    {priceOpen && (
                      <div className="py-4">
                        <Slider
                          value={localPriceRange}
                          min={priceRangeValues[0]}
                          max={priceRangeValues[1]}
                          step={100}
                          onValueChange={(val) => setLocalPriceRange([val[0], val[1]])}
                        />

                        <div className="flex items-center justify-between mt-4 gap-2">
                          <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">Min</label>
                            <input
                              type="number"
                              value={localPriceRange[0]}
                              className="w-full rounded-md border px-3 py-2 text-sm"
                              onChange={(e) =>
                                setLocalPriceRange([Number(e.target.value), localPriceRange[1]])
                              }
                            />
                          </div>
                          <span className="mt-5 text-gray-400">-</span>
                          <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">Max</label>
                            <input
                              type="number"
                              value={localPriceRange[1]}
                              className="w-full rounded-md border px-3 py-2 text-sm"
                              onChange={(e) =>
                                setLocalPriceRange([localPriceRange[0], Number(e.target.value)])
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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

                <div className="px-4 py-2 bg-white rounded shadow-sm text-sm">
                  {currentPage} / {totalPages}
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
              <span className="bg-blue-600 text-white px-1.5 py-0.5 text-xs rounded-full">
                {selectedBrands.length + (localPriceRange[0] !== priceRangeValues[0] || localPriceRange[1] !== priceRangeValues[1] ? 1 : 0)}
              </span>
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
              {/* Categories */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {loadingFilters ? (
                    <p className="text-xs text-gray-500">Loading...</p>
                  ) : allCategories.length === 0 ? (
                    <p className="text-xs text-gray-500">No categories</p>
                  ) : (
                    allCategories.map((cat) => (
                      <label key={cat.id} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{cat.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Brand */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {loadingFilters ? (
                    <p className="text-xs text-gray-500">Loading...</p>
                  ) : (
                    displayBrands.slice(0, 10).map((brand) => (
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

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                <Slider
                  value={localPriceRange}
                  min={priceRangeValues[0]}
                  max={priceRangeValues[1]}
                  step={100}
                  onValueChange={(val) => setLocalPriceRange([val[0], val[1]])}
                />
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="number"
                    value={localPriceRange[0]}
                    onChange={(e) => setLocalPriceRange([Number(e.target.value || 0), localPriceRange[1]])}
                    className="w-1/2 rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    value={localPriceRange[1]}
                    onChange={(e) => setLocalPriceRange([localPriceRange[0], Number(e.target.value || priceRangeValues[1])])}
                    className="w-1/2 rounded-md border px-3 py-2 text-sm"
                  />
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
                { value: "price-high", label: "Price: High to Low" },
                { value: "price-low", label: "Price: Low to High" },
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
