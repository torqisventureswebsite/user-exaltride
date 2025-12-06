"use client";

import { CategoryCard, type CategoryCardProps } from "@/components/categories/CategoryCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";
import type { Product } from "@/lib/api/products";
import type { Category } from "@/lib/api/categories";

interface CategoryWithProducts {
  category: Category & { item_count: number };
  productImages: string[];
  bgColor: string;
}

export function CategoriesSection() {
  const [categoryData, setCategoryData] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoriesWithProducts() {
      try {
        setLoading(true);
        
        // Fetch all categories
        const categories = await fetchCategories();
        
        // Get only top-level categories (level 0)
        const topCategories = categories.filter((c) => c.level === 0);

        // Fetch products for each category and count them
        const categoriesWithCounts = await Promise.all(
          topCategories.map(async (category) => {
            try {
              const { products } = await fetchProducts({ 
                category: category.id,
                limit: 100 
              });
              
              return {
                category,
                productCount: products.length,
                products: products.slice(0, 5), // Get first 5 products for images
              };
            } catch (error) {
              console.error(`Error fetching products for category ${category.id}:`, error);
              return {
                category,
                productCount: 0,
                products: [],
              };
            }
          })
        );

        // Sort by product count and take top 3
        const topThreeCategories = categoriesWithCounts
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, 3);

        // Define different background colors for each card
        const bgColors = [
          "bg-gradient-to-br from-yellow-200 to-yellow-300",
          "bg-gradient-to-br from-orange-200 to-orange-300",
          "bg-gradient-to-br from-amber-200 to-amber-300",
        ];

        // Build category data with product images
        const data: CategoryWithProducts[] = topThreeCategories.map((item, index) => {
          // Get product images
          const productImages = item.products
            .map((p) => p.primary_image || "/images/image1.jpg")
            .filter(Boolean)
            .slice(0, 5);

          // If not enough images, fill with default
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
            bgColor: bgColors[index % bgColors.length],
          };
        });

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
        )}
      </div>
    </section>
  );
}
