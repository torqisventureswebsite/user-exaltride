"use client";

import { Zap, Clock } from "lucide-react";

export default function FlashSaleBar() {
  return (
    <div className="w-full bg-gradient-to-r from-[#C90009] to-[#FBC84C] text-white">
      <div className="container mx-auto px-4 h-10 flex items-center justify-center gap-6 text-xs md:text-sm font-medium">
        
        {/* Left: Flash Text */}
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4" />
          <span>Flash Sale: Extra 10% OFF – Use code</span>
          <span className="font-bold tracking-wide ml-1">FLASH10</span>
        </div>

        {/* Divider */}
        <span className="opacity-60">|</span>

        {/* Right: Timer */}
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Ends in: 2h 34m</span>
        </div>

      </div>
    </div>
  );
}
