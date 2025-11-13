"use client";

import { CategoryCard } from "@/components/categories/CategoryCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo } from "react";
import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";

export function CategoriesSection() {
  // Get only top-level categories
  const topCategories = categoriesData.filter((c) => c.level === 0);

  // Build category data with product images and counts
  const categoryData = useMemo(() => {
    return topCategories.slice(0, 3).map((category, index) => {
      // Get products for this category
      const categoryProducts = productsData.filter(
        (p) => p.category_id === category.id
      );

      // Get product images
      const productImages = categoryProducts
        .map((p) => p.primary_image || "/images/image1.jpg")
        .filter(Boolean)
        .slice(0, 5);

      // If not enough images, fill with default
      while (productImages.length < 5) {
        productImages.push("/images/image1.jpg");
      }

      // Define different background colors for each card
      const bgColors = [
        "bg-gradient-to-br from-yellow-200 to-yellow-300",
        "bg-gradient-to-br from-orange-200 to-orange-300",
        "bg-gradient-to-br from-amber-200 to-amber-300",
      ];

      return {
        category: {
          ...category,
          item_count: categoryProducts.length,
        },
        productImages,
        bgColor: bgColors[index % bgColors.length],
      };
    });
  }, [topCategories]);

  return (
    <section className="bg-gray-50 py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900">
              Shop by Categories
            </h2>
            <p className="mt-1 md:mt-2 text-xs md:text-base text-gray-600">Explore car accessories</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">
            Browse all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Category Cards Grid - Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto pb-4 md:overflow-visible">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categoryData.map((data) => (
              <div key={data.category.id} className="flex-shrink-0 w-auto">
                <CategoryCard
                  category={data.category}
                  productImages={data.productImages}
                  bgColor={data.bgColor}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
