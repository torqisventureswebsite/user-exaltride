"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider"; // your slider
// If you use Card/Badge components on desktop, we simply use divs here.

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  // data & state lifted from parent
  parentCategories,
  selectedBrands,
  toggleBrand,
  localRange,
  setLocalRange,
  priceRange,
  clearAll,
  applyFilters, // () => void
}: {
  isOpen: boolean;
  onClose: () => void;
  parentCategories: { id: number; name: string; item_count?: number }[];
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  localRange: [number, number];
  setLocalRange: (r: [number, number]) => void;
  priceRange: [number, number];
  clearAll: () => void;
  applyFilters: () => void;
}) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-50
          h-[85vh] max-h-[900px]
          bg-white rounded-t-2xl shadow-xl
          transform transition-transform duration-300
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          flex flex-col
        `}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 underline"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-4 py-4 space-y-6">
          {/* CATEGORIES */}
          <section>
            <h4 className="text-sm font-medium mb-3">Categories</h4>
            <div className="flex flex-col gap-2">
              {parentCategories.map((c) => (
                <label key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{/* optional icon mapping */}</span>
                    <span className="text-sm">{c.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">({c.item_count || 0})</span>
                </label>
              ))}
            </div>
          </section>

          {/* PRICE RANGE */}
          <section>
            <h4 className="text-sm font-medium mb-3">Price Range</h4>
            <div className="px-1">
              <Slider
                value={localRange}
                min={priceRange[0]}
                max={priceRange[1]}
                step={100}
                onValueChange={(val) => setLocalRange([val[0], val[1]])}
              />
            </div>

            <div className="flex items-center gap-2 mt-3">
              <input
                type="number"
                value={localRange[0]}
                onChange={(e) => setLocalRange([Number(e.target.value || 0), localRange[1]])}
                className="w-1/2 rounded-md border px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={localRange[1]}
                onChange={(e) => setLocalRange([localRange[0], Number(e.target.value || priceRange[1])])}
                className="w-1/2 rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div className="text-xs text-gray-400 mt-2 flex justify-between">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </section>

          {/* BRANDS */}
          <section>
            <h4 className="text-sm font-medium mb-3">Brands</h4>
            <div className="flex flex-col gap-2">
              {["Sony", "Pioneer", "Bosch", "JBL"].map((b) => (
                <label key={b} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{b}</span>
                  </div>
                  <span className="text-xs text-gray-500">(96)</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Footer (Apply) */}
        <div className="px-4 py-3 border-t">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clearAll();
              }}
              className="flex-1 border rounded-lg px-4 py-3 text-sm text-gray-700"
            >
              Clear
            </button>

            <button
              onClick={() => {
                applyFilters();
                onClose();
              }}
              className="flex-1 bg-blue-700 text-white rounded-lg px-4 py-3 text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
