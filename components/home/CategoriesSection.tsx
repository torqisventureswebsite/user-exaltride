"use client";

import { CategoryCard } from "@/components/categories/CategoryCard";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";
import type { Category } from "@/lib/api/categories";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryWithProducts {
  category: Category & { item_count: number };
  productImages: string[];
  bgColor: string;
}

export function CategoriesSection() {
  const [categoryData, setCategoryData] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ SCROLL LOGIC
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 340; // category card width + gap
    const scrollAmount = cardWidth * 3;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  // ✅ DATA FETCH (TOP 8 POPULATED)
  useEffect(() => {
    async function loadCategoriesWithProducts() {
      try {
        setLoading(true);

        const categories = await fetchCategories();
        const topCategories = categories.filter((c) => c.level === 0);

        const categoriesWithCounts = await Promise.all(
          topCategories.map(async (category) => {
            try {
              const { products } = await fetchProducts({
                category: category.id,
                limit: 100,
              });

              return {
                category,
                productCount: products.length,
                products: products.slice(0, 5),
              };
            } catch {
              return {
                category,
                productCount: 0,
                products: [],
              };
            }
          })
        );

        // ✅ TAKE TOP 8 (NOT 3)
        const topEightCategories = categoriesWithCounts
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, 8);

        const bgColors = [
          "bg-gradient-to-br from-yellow-200 to-yellow-300",
          "bg-gradient-to-br from-orange-200 to-orange-300",
          "bg-gradient-to-br from-amber-200 to-amber-300",
          "bg-gradient-to-br from-lime-200 to-lime-300",
          "bg-gradient-to-br from-blue-200 to-blue-300",
          "bg-gradient-to-br from-purple-200 to-purple-300",
          "bg-gradient-to-br from-pink-200 to-pink-300",
          "bg-gradient-to-br from-teal-200 to-teal-300",
        ];

        const data: CategoryWithProducts[] = topEightCategories.map(
          (item, index) => {
            const productImages = item.products
              .map((p) => p.primary_image || "/images/image1.jpg")
              .filter(Boolean)
              .slice(0, 5);

            while (productImages.length < 5) {
              productImages.push("/images/image1.jpg");
            }

            return {
              category: {
                id: item.category.id,
                name: item.category.name,
                description: item.category.description,
                slug: item.category.slug,
                item_count: item.productCount,
              },
              productImages,
              bgColor: "bg-[#FBC84C]",
            };
          }
        );

        setCategoryData(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategoriesWithProducts();
  }, []);

  return (
    <section className="bg-gray-50 py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-[#101828]">
              Shop by Categories
            </h2>
            <p className="mt-1 md:mt-2 text-xs md:text-base text-gray-600">
              Explore car accessories
            </p>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base"
          >
            Browse all
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* ✅ LOADING STATE */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : categoryData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No categories available</p>
          </div>
        ) : (
          // ✅ REAL SCROLLER WITH ARROWS
          <div className="relative">
<button
  onClick={() => scroll("left")}
  className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
>
  <ChevronLeft className="h-5 w-5" />
</button>

<button
  onClick={() => scroll("right")}
  className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
>
  <ChevronRight className="h-5 w-5" />
</button>


            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pl-0 pr-6"
            >
              {categoryData.map((data) => (
                <div
                  key={data.category.id}
                  className="min-w-[320px] max-w-[320px] shrink-0"
                >
                  <CategoryCard
                    category={data.category}
                    productImages={data.productImages}
                    bgColor={data.bgColor}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
