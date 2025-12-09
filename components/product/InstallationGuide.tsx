"use client";

import { Clock, Wrench, Info } from "lucide-react";

export default function InstallationGuide() {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
      <h3 className="text-sm font-semibold text-[#001F5F]">
        Installation Guide
      </h3>

      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Clock className="h-4 w-4 text-orange-500" />
        <span>Installation Time: 30–45 mins</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Wrench className="h-4 w-4 text-blue-600" />
        <span>Difficulty Level: Easy</span>
      </div>

      <button className="w-full mt-3 bg-[#001F5F] text-white py-2 rounded-lg text-sm hover:bg-blue-800">
        Watch Video Guide
      </button>

      <button className="w-full border mt-2 py-2 rounded-lg text-sm">
        Download Manual
      </button>
    </div>
  );
}
