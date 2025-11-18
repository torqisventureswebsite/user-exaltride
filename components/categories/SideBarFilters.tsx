"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, Filter } from "lucide-react";

import categoriesData from "@/data/categories.json";

export default function SidebarFilters({
  selectedBrands,
  toggleBrand,
  priceRange,
  localRange,
  setLocalRange,
  clearAll,
}: {
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  priceRange: [number, number];
  localRange: [number, number];
  setLocalRange: (range: [number, number]) => void;
  clearAll: () => void;
}) {
  // Parent-level categories only
  const parentCategories = categoriesData.filter((c) => c.parent_id === null);

  // All brands manually processed at parent level (CategoryPageClient passes these)
  // So no brand logic here

  return (
    <Card className="p-0 overflow-hidden border rounded-xl shadow-sm">
      
      {/* Blue Header */}
      <div className="bg-blue-600 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 font-medium">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <button
          onClick={clearAll}
          className="text-white text-sm underline"
        >
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
            {parentCategories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* ICONS based on category name (replace with your own mapping logic) */}
                  <span className="text-xl">
                    {cat.name.includes("Audio") && "🎵"}
                    {cat.name.includes("Interior") && "🪑"}
                    {cat.name.includes("Exterior") && "🚗"}
                    {cat.name.includes("Electronics") && "📱"}
                    {cat.name.includes("Lighting") && "💡"}
                    {cat.name.includes("Security") && "🔒"}
                    {cat.name.includes("Cleaning") && "🧽"}
                    {cat.name.includes("Performance") && "⚡"}
                  </span>

                  <span className="text-sm">{cat.name}</span>
                </div>

                <span className="text-xs text-gray-500">
                  ({cat.item_count || 0})
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

          {/* Modern Slider */}
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
            {["Sony", "Pioneer", "Bosch", "JBL"].map((b) => (
              <label key={b} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                  />
                  <span className="text-sm">{b}</span>
                </div>

                <span className="text-xs text-gray-500">(96)</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
