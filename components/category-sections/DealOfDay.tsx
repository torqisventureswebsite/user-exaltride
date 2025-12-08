"use client";

import { Flame, Clock } from "lucide-react";

export default function DealOfDay() {
  return (
    <div className="mb-4">
      <div className="bg-[#FFD34E] rounded-2xl p-4 shadow-md">
        {/* TOP SECTION */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#FFE6A3]">
              <Flame className="h-4 w-4 text-[#FF9F0A]" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Deal of the Day
              </h3>
              <p className="text-[11px] text-gray-500">
                Limited time offers
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-xs text-gray-500">Ending Soon</p>
              <div className="flex items-center gap-1 text-[#001F5F] font-semibold text-sm mt-1">
                <Clock className="h-4 w-4" />
                <span>23:45:30</span>
              </div>
            </div>

            <span className="bg-[#FF3B30] text-white text-[10px] px-2 py-1 rounded">
              65% OFF
            </span>
          </div>

          <p className="text-[12px] text-gray-600 mt-3">
            12 special deals
          </p>
        </div>

        {/* CTA BUTTON */}
        <button className="mt-4 w-full bg-[#001F5F] text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-blue-800 transition">
          View Deals →
        </button>
      </div>
    </div>
  );
}
