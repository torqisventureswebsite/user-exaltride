"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import AllCategoriesDrawer from "@/components/categories/AllCategoriesDrawer";

export default function TopBar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false); // ✅ Step 3 implemented

  // Fetch categories
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1/categories"
        );
        const json = await res.json();
        setCategories(json.data ?? []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full border-t border-gray-200 bg-white py-3 px-4">
        <p className="text-gray-400 text-sm">Loading categories...</p>
      </div>
    );
  }

  // 🔥 Sort categories by product_count (DESC)
  const sorted = [...categories].sort(
    (a, b) => b.product_count - a.product_count
  );

  // Show TOP 6 in navbar
  const topSix = sorted.slice(0, 6);

  // Remaining categories go in drawer
  const restCategories = sorted.slice(6);

  return (
    <>
      {/* === TOP CATEGORY BAR === */}
      <div className="w-full border-t border-gray-200 bg-white">
        <div className="container mx-auto flex items-center gap-6 px-4 md:px-6 py-3 overflow-x-auto scrollbar-hide">

          {/* === ALL CATEGORIES BUTTON === */}
          <button
            onClick={() => setDrawerOpen(true)} // 🔥 Step 3
            className="flex items-center gap-2 md:gap-4 text-gray-800 text-sm md:text-base font-medium hover:text-blue-600"
          >
            <Menu size={18} />
            <span className="w-[100px]">All Categories</span>
          </button>

          {/* === TOP 6 CATEGORIES === */}
          <div className="flex items-center gap-4 md:gap-8 whitespace-nowrap">
            {topSix.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="text-gray-700 text-sm md:text-base font-medium hover:text-blue-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* === DRAWER WITH REST OF CATEGORIES === */}
      <AllCategoriesDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)} // 🔥 Step 3
        categories={sorted}
      />
    </>
  );
}
