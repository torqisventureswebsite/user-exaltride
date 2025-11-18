"use client";

import categories from "@/data/categories.json";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  const topCategories = categories
    .filter((cat) => cat.is_active && cat.parent_id === null)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="w-full border-t border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-start gap-6 px-4 md:px-6 py-3 overflow-x-auto scrollbar-hide">

        {/* ❌ Removed Link — ✔ Converted to button */}
        <button
          className="
            flex items-center gap-2 md:gap-4 
            text-gray-800 text-sm md:text-base font-medium 
            hover:text-blue-600 whitespace-nowrap flex-shrink-0
          "
        >
          <Menu size={18} className="md:w-5 md:h-5" />
          All Categories
        </button>

        {/* Top Level Categories */}
        <div className="flex items-center gap-4 md:gap-8 whitespace-nowrap">
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}   // ✔ FIXED ROUTE
              className="
                text-gray-700 text-sm md:text-base font-medium 
                hover:text-blue-600 transition-colors flex-shrink-0
              "
            >
              {cat.name}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
