"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";
import type { Category } from "@/lib/api/categories";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

interface CategoryWithCount extends Category {
  productCount: number;
  sampleImage: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const allCategories = await fetchCategories();
        
        // Get top-level categories only
        const topCategories = allCategories.filter((c) => c.level === 0);

        // Fetch product count and sample image for each category
        const categoriesWithCounts = await Promise.all(
          topCategories.map(async (category) => {
            try {
              const { products } = await fetchProducts({
                category: category.id,
                limit: 1,
              });

              return {
                ...category,
                productCount: products.length > 0 ? products.length : 0,
                sampleImage: products[0]?.primary_image || "/images/image1.jpg",
              };
            } catch {
              return {
                ...category,
                productCount: 0,
                sampleImage: "/images/image1.jpg",
              };
            }
          })
        );

        // Sort by product count
        categoriesWithCounts.sort((a, b) => b.productCount - a.productCount);
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            All Categories
          </h1>
          <p className="text-gray-600 mt-2">
            Browse all car accessory categories
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="aspect-square relative bg-gradient-to-br from-[#FBC84C]/20 to-[#FBC84C]/40 p-4">
                  <Image
                    src={category.sampleImage}
                    alt={category.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#001F5F] transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {category.productCount > 0
                      ? `${category.productCount}+ products`
                      : "Explore products"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
