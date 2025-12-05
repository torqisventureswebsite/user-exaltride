"use client";

import { Tag } from "lucide-react";

export default function ApplyCoupon() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Apply Coupon</h2>
      </div>

      {/* Input + Button */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter coupon code"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button className="bg-[#6E7FA0] hover:bg-[#617092] text-white font-semibold px-5 rounded-lg">
          Apply
        </button>
      </div>

      {/* Separator */}
      <hr className="my-3" />

      {/* Available Coupons */}
      <p className="text-sm text-gray-600 mb-2">Available Coupons:</p>

      <div className="flex gap-2">
        <span className="px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-700 font-medium">
          EXALTI10
        </span>

        <span className="px-3 py-1 text-xs rounded-md bg-orange-100 text-orange-600 font-medium">
          SAVE15
        </span>
      </div>
    </div>
  );
}
