// components/category/CategoryPageClient.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/components/product/ProductCard";
import CategoryHero from "./CategoryHero";
import OffersSection from "@/components/product/OffersSection";
import CategoryExtras from "@/components/category-sections/CategoryExtras";
import SidebarFilters from "./SideBarFilters";
import MobileFiltersButton from "@/components/categories/MobileFiltersButton";
import MobileFilterDrawer from "@/components/categories/MobileFilterDrawer";
import { useSearchParams } from "next/navigation";
import { fetchBrands } from "@/lib/api/brands";
import { fetchCategories, type Category } from "@/lib/api/categories";
import CategoryOfferCarousel from "@/components/categories/CategoryOfferCarousel";
import CategoryTopControls from "./CategoryTopControls";
import DealOfDay from "../category-sections/DealOfDay";
export default function CategoryPageClient({
  category,
  initialProducts,
  subCategories,
}: {
  category: { id: string; name: string; description?: string; slug: string };
  initialProducts: Product[];
  subCategories: { id: string; name: string; slug: string }[];
}) {

  const [isSortOpen, setIsSortOpen] = useState(false);
  const searchParams = useSearchParams();
  const brandFromUrl = searchParams.get("brand"); // e.g. "mann-filter"
  // ---------- FILTER STATE ----------
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [allBrands, setAllBrands] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const prices = initialProducts.map((p) => p.price || 0);
    const min = Math.min(...prices, 0);
    const max = Math.max(...prices, 0);
    return [min, max];
  });
  const [localRange, setLocalRange] = useState<[number, number]>(priceRange);
  const [sortBy, setSortBy] = useState<
    "relevance" | "price-asc" | "price-desc" | "rating" | "newest"
  >("relevance");

  // filter drawer state (mobile)
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ---------- PAGINATION ----------
  const itemsPerPage = 12;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBrands().then((data) => setAllBrands(data));
    fetchCategories().then((data) => setAllCategories(data));
  }, []);

  useEffect(() => {
    if (brandFromUrl && allBrands.length) {
      const match = allBrands.find((b) => b.slug === brandFromUrl);
      if (match) {
        setSelectedBrands([match.name]); // auto-tick the sidebar brand
      }
    }
  }, [brandFromUrl, allBrands]);


  // ---------- DERIVED DATA ----------
  // brands available from products
  const brands = useMemo(() => {
    const set = new Set(
      initialProducts.map((p) => p.brand_name).filter(Boolean)
    );
    return Array.from(set).sort();
  }, [initialProducts]);

  // Categories for filters - map item_count to product_count for consistency
  const categoriesForFilter = useMemo(
    () =>
      allCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        product_count: c.item_count || 0,
      })),
    [allCategories]
  );

  // Deduplicate products by ID
  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    return initialProducts.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [initialProducts]);

  // ---------- FILTER LOGIC ----------
  const filtered = useMemo(() => {
    let list = uniqueProducts.slice();

    if (selectedSubcat) {
      list = list.filter((p) => p.category_id === selectedSubcat);
    }

    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand_name || ""));
    }

    // price filter using localRange
    list = list.filter((p) => {
      const price = p.price || 0;
      return price >= localRange[0] && price <= localRange[1];
    });

    // sort
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
      default:
        break;
    }

    return list;
  }, [uniqueProducts, selectedSubcat, selectedBrands, localRange, sortBy]);

  // pagination calc
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const visible = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // ---------- HELPERS ----------
  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const clearAll = () => {
    setSelectedSubcat(null);
    setSelectedBrands([]);
    setLocalRange(priceRange);
    setSortBy("relevance");
    setPage(1);
  };

  // apply filters from mobile drawer (you can add API calls here)
  const applyFilters = () => {
    setPage(1);
    // If you want to persist filters to the URL, do it here.
    // If you want to call the server for filtered products, call API here.
  };

  // ---------- UI ----------
  // total results (for mobile button)
  const totalResults = filtered.length;

  return (
    <div className="min-h-screen">
      <div className="mb-0">
        <CategoryHero
          name={category.name}
          productCount={initialProducts.length}
          description={category.description}
        />
      </div>

      <div className="-mt-1">
        <CategoryOfferCarousel />
      </div>
      {/* Top mobile filter row (mobile-only) */}
      <div className="lg:hidden px-0">
        <div className="flex items-center gap-2 py-3 overflow-x-auto">
          <MobileFiltersButton
            onOpen={() => setIsFilterOpen(true)}
            totalResults={totalResults}
          />
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <button
            className="px-2 py-1.5 border rounded-lg text-xs"
            onClick={() => setIsSortOpen(true)}
          >
            Sort
          </button>
            {/* <button className="px-2 py-1.5 border rounded-lg text-xs">Grid</button> */}
          </div>
        </div>
      </div>

      {/* Main container */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 px-4 md:px-6">
        {/* Sidebar (desktop only) - sticky with separate scroll */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <SidebarFilters
              categories={categoriesForFilter.length > 0 ? categoriesForFilter : [{ ...category, product_count: 0 }, ...subCategories.map(c => ({ ...c, product_count: 0 }))]}
              brands={allBrands}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              selectedCategory={selectedSubcat}
              setSelectedCategory={setSelectedSubcat}
              priceRange={priceRange}
              localRange={localRange}
              setLocalRange={setLocalRange}
              clearAll={clearAll}
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="col-span-1 lg:col-span-9 space-y-4">
          {/* CategoryTopControls - hidden on mobile since we have mobile filter row */}
          <div className="hidden lg:block">
            <CategoryTopControls sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {/* Product cards grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-3 lg:gap-5">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} showOffers />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <Button
              onClick={() => setPage((s) => Math.max(1, s - 1))}
              variant="outline"
              disabled={page === 1}
            >
              <ChevronLeft />
            </Button>

            <div className="px-3 py-2 bg-white rounded shadow-sm">
              {page} / {totalPages}
            </div>

            <Button
              onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
              variant="outline"
              disabled={page === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>

          {/* Category extras / other sections */}
          <div className="mt-10">
            <CategoryExtras />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        parentCategories={categoriesForFilter}
        brands={allBrands}
        selectedBrands={selectedBrands}
        toggleBrand={toggleBrand}
        selectedCategory={selectedSubcat}
        setSelectedCategory={setSelectedSubcat}
        localRange={localRange}
        setLocalRange={setLocalRange}
        priceRange={priceRange}
        clearAll={clearAll}
        applyFilters={() => {
          applyFilters();
          setIsFilterOpen(false);
        }}
      />
      {/* Mobile sort drawer */}
{isSortOpen && (
  <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
    <div className="absolute bottom-0 w-full bg-white rounded-t-xl p-4">
      {[
        ["relevance", "Relevance"],
        ["price-asc", "Price: Low to High"],
        ["price-desc", "Price: High to Low"],
        ["rating", "Top Rated"],
        ["newest", "Newest"],
      ].map(([key, label]) => (
        <button
          key={key}
          className="w-full text-left py-3 border-b"
          onClick={() => {
            setSortBy(key as any);
            setIsSortOpen(false);
          }}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
)}

    </div>
    
);
  

}
