"use client";

import { ShieldCheck, Truck, LayoutGrid, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  sortBy: string;
  setSortBy: (v: any) => void;
}

export default function CategoryTopControls({ sortBy, setSortBy }: Props) {
  return (
    <div className="w-full bg-[#001F5F] text-white rounded-xl px-5 py-4 flex items-center justify-between mb-5">
      
      {/* ✅ LEFT BADGES */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Truck className="h-4 w-4 text-yellow-400" />
          Fast Delivery
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="h-4 w-4 text-yellow-400" />
          Warranty
        </div>
      </div>

      {/* ✅ RIGHT CONTROLS */}
      <div className="flex items-center gap-3">
        
        {/* SORT DROPDOWN */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0A2F6B] text-white text-sm px-4 py-2 rounded-lg border border-white/20 focus:outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* GRID BUTTON */}
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          Grid
        </Button>
      </div>
    </div>
  );
}