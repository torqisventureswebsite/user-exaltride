"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export default function SidebarFilters({
  categories,
  brands,
  selectedBrands,
  toggleBrand,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  localRange,
  setLocalRange,
  clearAll,
}: {
  categories: { id: string; name: string; slug: string; product_count?: number }[];
  brands: { id: string; name: string; slug: string; product_count?: number }[]; 
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  priceRange: [number, number];
  localRange: [number, number];
  setLocalRange: (range: [number, number]) => void;
  clearAll: () => void;
}) {
  // Dropdown open states
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  // Sort categories by product_count DESC
  const sorted = [...categories].sort(
    (a, b) => (b.product_count || 0) - (a.product_count || 0)
  );

  // Get selected category name for display
  const selectedCategoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.name 
    : null;

  // Get selected brands count for display
  const selectedBrandsCount = selectedBrands.length;

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

      <div className="px-4 space-y-1">

        {/* BRANDS DROPDOWN */}
        <div className="overflow-hidden">
          <button
            onClick={() => setBrandsOpen(!brandsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Brands</span>
              {selectedBrandsCount > 0 && (
                <span className="text-xs bg-[#001F5F] text-white px-2 py-0.5 rounded-full">
                  {selectedBrandsCount} selected
                </span>
              )}
            </div>
            {brandsOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {brandsOpen && (
            <div className="px-4 py-3 max-h-48 overflow-y-auto border-t bg-white">
              <div className="flex flex-col gap-2">
                {brands.map((b) => (
                  <label key={b.id} className="flex items-center justify-between cursor-pointer py-1 hover:bg-gray-50 rounded px-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.name)}
                        onChange={() => toggleBrand(b.name)}
                        className="h-4 w-4 accent-[#001F5F] rounded"
                      />
                      <span className={`text-sm ${selectedBrands.includes(b.name) ? 'font-medium text-[#001F5F]' : ''}`}>
                        {b.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PRICE RANGE DROPDOWN */}
        <div className="overflow-hidden">
          <button
            onClick={() => setPriceOpen(!priceOpen)}
            className="w-full flex items-center justify-between px-4 py-3 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Price Range</span>
              {(localRange[0] !== priceRange[0] || localRange[1] !== priceRange[1]) && (
                <span className="text-xs bg-[#001F5F] text-white px-2 py-0.5 rounded-full">
                  ₹{localRange[0]} - ₹{localRange[1]}
                </span>
              )}
            </div>
            {priceOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {priceOpen && (
            <div className="px-4 py-4 bg-white">
              <Slider
                value={localRange}
                min={priceRange[0]}
                max={priceRange[1]}
                step={100}
                onValueChange={(val) => setLocalRange([val[0], val[1]])}
              />

              <div className="flex items-center justify-between mt-4 gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    type="number"
                    value={localRange[0]}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    onChange={(e) =>
                      setLocalRange([Number(e.target.value), localRange[1]])
                    }
                  />
                </div>
                <span className="mt-5 text-gray-400">-</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    type="number"
                    value={localRange[1]}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    onChange={(e) =>
                      setLocalRange([localRange[0], Number(e.target.value)])
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-400 mt-3">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
