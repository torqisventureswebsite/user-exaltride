"use client";

import categories from "@/data/categories.json";
import { Menu } from "lucide-react";

export default function TopBar() {
  // Only top-level categories (parent_id = null)
  const topCategories = categories
    .filter((cat) => cat.is_active && cat.parent_id === null)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="w-full border-t border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-start gap-6 px-6 py-3 overflow-x-auto">
        {/* Menu Icon (All Categories) */}
        <button className="flex items-center gap-4 text-gray-800 font-medium hover:text-blue-600 whitespace-nowrap">
          <Menu size={20} />
          All Categories
        </button>

        {/* Dynamic Category Links */}
        <div className="flex items-center gap-8 whitespace-nowrap">
          {topCategories.map((cat) => (
            <button
              key={cat.id}
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
