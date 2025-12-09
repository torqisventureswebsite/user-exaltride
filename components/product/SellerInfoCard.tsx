"use client";

import { ShieldCheck, Star } from "lucide-react";

export default function SellerInfoCard() {
  return (
    <div className="bg-white border rounded-2xl p-4 space-y-4 shadow-sm">
      
      {/* STORE HEADER */}
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#001F5F] text-white font-bold">
          TD
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            TechDrive Pro Official Store
          </h3>

          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-[2px] rounded">
              Verified Seller
            </span>

            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              4.7 Seller Rating
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
        <div>Products</div>
        <div className="font-semibold text-right">2,847</div>

        <div>Response Time</div>
        <div className="font-semibold text-right">Within 2 hours</div>

        <div>Ship on Time</div>
        <div className="font-semibold text-right text-green-600">98%</div>
      </div>

      {/* CTA */}
      <button className="w-full border border-[#001F5F] text-[#001F5F] hover:bg-[#001F5F] hover:text-white font-medium py-2 rounded-lg text-sm">
        Visit Store
      </button>
    </div>
  );
}
