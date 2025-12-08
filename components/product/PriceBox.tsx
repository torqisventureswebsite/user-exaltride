"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

interface PriceBoxProps {
  price?: number;
  compareAt?: number | null;
}

export default function PriceBox({ price = 0, compareAt = null }: PriceBoxProps) {
  const [qty, setQty] = useState(1);

  const discount =
    compareAt && price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : 0;

  const savings = compareAt ? compareAt - price : 0;

  return (
    <div className="bg-[#F8FAFC] border rounded-xl p-4 space-y-3 shadow-sm">

      {/* PRICE ROW */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-2xl font-bold font-medium text-[#001F5F]">
          ₹{price.toLocaleString()}
        </span>

        {compareAt && (
          <span className="text-sm line-through text-gray-400">
            ₹{compareAt.toLocaleString()}
          </span>
        )}

        {discount > 0 && (
          <span className="bg-[#E6F0FF] text-[#0369A1] text-xs px-2 py-[2px] rounded font-semibold">
            {discount}% off
          </span>
        )}
      </div>

      {/* TAX INFO */}
      <p className="text-xs text-gray-500">Inclusive of all taxes</p>

      {/* SAVINGS */}
      {savings > 0 && (
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <Lock className="h-3 w-3 text-blue-600" />
          <span>You save ₹{savings.toLocaleString()} on this purchase</span>
        </div>
      )}

      <hr />

      {/* QUANTITY */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Quantity:</span>

        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-1 text-lg hover:bg-gray-100"
          >
            –
          </button>

          <span className="px-4 py-1 text-sm">{qty}</span>

          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-1 text-lg hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* STOCK WARNING */}
      <p className="text-xs text-[#D97706] font-medium">
        Limited stock available!
      </p>
    </div>
  );
}
