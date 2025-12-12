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
    </div>
  );
}
