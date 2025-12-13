"use client";

import { ShieldCheck, Truck, LayoutGrid, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  sortBy: string;
  setSortBy: (v: any) => void;
}

export default function CategoryTopControls({ sortBy, setSortBy }: Props) {
  return (
    <div className="w-full bg-[#001F5F] text-white rounded-xl px-3 md:px-5 py-3 md:py-4 flex items-center justify-between mb-4 md:mb-5 overflow-x-auto">
      
      {/* ✅ LEFT BADGES - Hidden on very small screens */}
      <div className="hidden sm:flex items-center gap-2 md:gap-4 flex-shrink-0">
        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium whitespace-nowrap">
          <Truck className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-400" />
          <span className="hidden md:inline">Fast</span> Delivery
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium whitespace-nowrap">
          <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-400" />
          Warranty
        </div>
      </div>

      {/* ✅ RIGHT CONTROLS */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        
        {/* SORT DROPDOWN */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0A2F6B] text-white text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2 rounded-lg border border-white/20 focus:outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* GRID BUTTON */}
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 md:gap-2 text-xs md:text-sm h-8 md:h-10">
          <LayoutGrid className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Grid
        </Button>
      </div>
    </div>
  );
}