"use client";

import {
  Check,
  Moon,
  ShieldAlert,
  Repeat,
  ParkingCircle
} from "lucide-react";

export default function KeyHighlights() {
  const highlights = [
    {
      icon: <Check className="h-4 w-4 text-blue-700" />,
      text: "4K Ultra HD Recording with 170° Wide Angle Lens",
    },
    {
      icon: <Moon className="h-4 w-4 text-blue-700" />,
      text: "Advanced Night Vision with HDR Technology",
    },
    {
      icon: <ShieldAlert className="h-4 w-4 text-blue-700" />,
      text: "Built-in G-Sensor for Accident Detection & Emergency Lock",
    },
    {
      icon: <Repeat className="h-4 w-4 text-orange-600" />,
      text: "Loop Recording with Support for 256GB SD Card",
    },
    {
      icon: <ParkingCircle className="h-4 w-4 text-orange-600" />,
      text: "24/7 Parking Mode Surveillance with Motion Detection",
    },
  ];

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm font-medium">
      <h3 className="text-lg font-semibold text-[#001F5F]">
        Key Highlights
      </h3>

      <ul className="space-y-3">
        {highlights.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="mt-[2px]">{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
