"use client";

import { MapPin, RotateCcw, ShieldCheck, Wallet } from "lucide-react";
import { useState } from "react";

export default function DeliveryAndServices() {
  const [pincode, setPincode] = useState("");

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm">
      {/* TITLE */}
      <h3 className="text-lg font-semibold text-[#001F5F] font-medium">
        Delivery & Services
      </h3>

      {/* PINCODE CHECK */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 border rounded-lg px-3 py-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            type="text"
            placeholder="Enter pincode"
            className="outline-none text-sm w-full"
          />
        </div>

        <button className="bg-[#001F5F] text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800">
          Check
        </button>
      </div>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-2 gap-4 pt-2 text-sm text-gray-700">

        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-blue-600" />
          <span>7 Days Return</span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>1 Year Warranty</span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-yellow-600" />
          <span>Secure Payment</span>
        </div>

        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-orange-600" />
          <span>Cash on Delivery</span>
        </div>

      </div>
    </div>
  );
}
