"use client";

import categories from "@/data/categories.json";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function CartTopBar() {
  const topCategories = categories
    .filter((cat) => cat.is_active && cat.parent_id === null)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="w-full bg-blue-900 text-white">
      <div className="container mx-auto flex items-center justify-start gap-6 px-4 md:px-6 py-3 overflow-x-auto scrollbar-hide">

        {/* Left Menu */}
        <button
          className="flex items-center gap-2 md:gap-4 text-sm md:text-base font-medium hover:text-yellow-300 whitespace-nowrap"
        >
          <Menu size={18} className="md:w-5 md:h-5" />
          All Categories
        </button>

        {/* Category Links */}
        <div className="flex items-center gap-4 md:gap-8 whitespace-nowrap">
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="
                text-white text-sm md:text-base font-medium 
                hover:text-yellow-300 transition-colors
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
