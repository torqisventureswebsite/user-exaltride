"use client";

import { CheckCircle } from "lucide-react";

export default function VehicleCompatibility() {
  const vehicles = [
    {
      name: "Honda City (2020–2024)",
      note: "Direct fit, no modifications needed",
    },
    {
      name: "Honda Amaze (2018–2024)",
      note: "Perfect match for sedan variant",
    },
    {
      name: "Hyundai Verna (2020–2024)",
      note: "Verified by 1247 owners",
    },
  ];

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm">
      <h3 className="text-lg font-semibold font-medium text-[#001F5F]">
        Vehicle Compatibility
      </h3>

      <div className="space-y-4">
        {vehicles.map((v, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-700 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{v.name}</p>
              <p className="text-xs text-gray-500">{v.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t">
        <button className="text-sm text-blue-700 font-medium hover:underline">
          View all 47 compatible vehicles
        </button>
      </div>
    </div>
  );
}
