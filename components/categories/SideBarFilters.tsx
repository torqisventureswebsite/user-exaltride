"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, Filter } from "lucide-react";

export default function SidebarFilters({
  categories,
  brands,
  selectedBrands,
  toggleBrand,
  priceRange,
  localRange,
  setLocalRange,
  clearAll,
}: {
  categories: { id: string; name: string; slug: string; product_count?: number }[];
  brands: { id: string; name: string; slug: string; product_count?: number }[]; 
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  priceRange: [number, number];
  localRange: [number, number];
  setLocalRange: (range: [number, number]) => void;
  clearAll: () => void;
}) {
  // 🔥 Sort categories by product_count DESC
  const sorted = [...categories].sort(
    (a, b) => (b.product_count || 0) - (a.product_count || 0)
  );

  // 🔥 Top 5 for sidebar
  const topFive = sorted.slice(0, 5);
  const remaining = sorted.slice(5);

  // Expand / collapse toggle
  const [showAll, setShowAll] = useState(false);

  return (
    <Card className="p-0 overflow-hidden border rounded-xl shadow-sm">
      {/* Header */}
      <div className="bg-[#001F5F] text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 font-medium">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <button onClick={clearAll} className="text-white text-sm underline">
          Clear All
        </button>
      </div>

      <div className="p-4">
        {/* CATEGORIES SECTION */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <ChevronDown className="h-4 w-4" />
            Categories
          </h3>

          <div className="flex flex-col gap-3">
            {/* TOP 5 CATEGORIES */}
            {topFive.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between">
                <span className="text-sm">{cat.name}</span>
                <span className="text-xs text-gray-500">
                  ({cat.product_count || 0})
                </span>
              </div>
            ))}

            {/* TOGGLE BUTTON */}
            {remaining.length > 0 && (
              <button
                className="text-blue-600 text-sm mt-1"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll
                  ? "Show Less"
                  : `+ ${remaining.length} more categories`}
              </button>
            )}

            {/* REMAINING CATEGORIES */}
            {showAll &&
              remaining.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between">
                  <span className="text-sm">{cat.name}</span>
                  <span className="text-xs text-gray-500">
                    ({cat.product_count || 0})
                  </span>
                </div>
              ))}
          </div>
        </div>

        <hr className="my-4" />

        {/* PRICE RANGE SECTION */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            Price Range
          </h3>

          <Slider
            value={localRange}
            min={priceRange[0]}
            max={priceRange[1]}
            step={100}
            onValueChange={(val) => setLocalRange([val[0], val[1]])}
          />

          <div className="flex items-center justify-between mt-4">
            <input
              type="number"
              value={localRange[0]}
              className="w-20 rounded-md border px-2 py-1 text-sm"
              onChange={(e) =>
                setLocalRange([Number(e.target.value), localRange[1]])
              }
            />
            <span className="mx-1">-</span>
            <input
              type="number"
              value={localRange[1]}
              className="w-20 rounded-md border px-2 py-1 text-sm"
              onChange={(e) =>
                setLocalRange([localRange[0], Number(e.target.value)])
              }
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        <hr className="my-4" />

        {/* BRANDS SECTION */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            Brands
          </h3>

          <div className="flex flex-col gap-3">
          {brands.map((b) => (
            <label key={b.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b.name)}
                  onChange={() => toggleBrand(b.name)}
                />
                <span className="text-sm">{b.name}</span>
              </div>

              <span className="text-xs text-gray-500">
                ({b.product_count || 0})
              </span>
            </label>
          ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
