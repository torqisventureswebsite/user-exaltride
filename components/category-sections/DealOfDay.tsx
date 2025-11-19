"use client";

import { Flame, Clock } from "lucide-react";

export default function DealOfDay() {
  return (
    <div className="mt-4">
      {/* Outer container exactly like Figma */}
      <div className="border border-[#FBC84C] rounded-2xl p-4 bg-gradient-to-r from-[#FFFCF3] to-[#FFF9E4] flex items-center justify-between gap-4">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          
          {/* Icon container */}
          <div className="p-3 rounded-xl bg-[#FBC84C33] flex items-center justify-center">
            <Flame className="h-6 w-6 text-[#FBC84C]" />
          </div>

          {/* Title + Subtitle */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 text-base">
                Deal of the Day
              </h3>

              <span className="bg-[#FF3B30] text-white text-[10px] px-2 py-[2px] rounded">
                Up to 65% OFF
              </span>
            </div>

            <p className="text-[13px] text-gray-600 mt-[2px]">
              12 special offers available today
            </p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 shrink-0">

          {/* Timer */}
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-gray-500 leading-none">Ends in</p>
            <div className="flex items-center gap-1 text-blue-700 font-semibold text-lg leading-none">
              <Clock className="h-4 w-4" />
              <span>23:45:30</span>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-[#0052CC] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-blue-800">
            View All Deals →
          </button>

        </div>
      </div>
    </div>
  );
}
