"use client";

import { ShoppingCart, Star, Package } from "lucide-react";

export default function BundlePriceBox() {
  return (
    <div className="bg-gradient-to-b from-[#FFFEF9] to-[#FFFBF0] border border-yellow-200 p-4 rounded-2xl shadow-sm space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-600 fill-yellow-500" />
        <h3 className="font-semibold text-gray-900">Bundle & Save More</h3>
      </div>

      <p className="text-sm text-gray-600">
        Buy this product with compatible accessories and get extra discounts
      </p>

      {/* ITEMS */}
      <div className="bg-white rounded-xl border p-4 space-y-3">

        {/* ITEM 1 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">Memory Card 128GB</p>
            <p className="text-xs text-gray-600">Class 10, High Speed</p>
          </div>
          <span className="font-semibold text-gray-800">+₹899</span>
        </div>

        {/* ITEM 2 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">Car Mount Holder</p>
            <p className="text-xs text-gray-600">Universal Dashboard Mount</p>
          </div>
          <span className="font-semibold text-gray-800">+₹499</span>
        </div>
      </div>

      {/* OFFER BOX */}
      <div className="bg-[#FFF1C2] border border-yellow-300 rounded-xl p-4 text-sm">
        <p className="font-medium text-gray-800">⭐ Bundle Offer</p>
        <p className="mt-1 text-gray-700">
          Buy all 3 items together:{" "}
          <span className="line-through">₹7,397</span>{" "}
          <span className="font-semibold text-gray-900">₹6,799</span>
        </p>
        <p className="text-green-700 font-medium mt-1">
          Save ₹598 with this bundle!
        </p>
      </div>

      {/* CTA BUTTON */}
      <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        Add Bundle to Cart
      </button>
    </div>
  );
}
