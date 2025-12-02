// components/category-sections/BuyingGuide.tsx

import { Info } from "lucide-react";

export default function BuyingGuide() {
  const items = [
    { id: 1, title: "Check Compatibility", desc: "Ensure the system fits your car model and dashboard size" },
    { id: 2, title: "Features", desc: "Look for Android Auto, CarPlay, GPS, and Bluetooth connectivity" },
    { id: 3, title: "Screen Quality", desc: "Higher resolution screens provide better visibility" },
    { id: 4, title: "Installation", desc: "Check if professional installation is included or required" },
  ];

  return (
    <div className="border border-green-300 p-6 rounded-xl bg-green-50">
      <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 text-green-700">
        <Info className="h-5 w-5" />
        Buying Guide: How to Choose the Right Audio System
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((i) => (
          <div key={i.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border">
            <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
              {i.id}
            </div>
            <div>
              <h3 className="font-medium">{i.title}</h3>
              <p className="text-sm text-gray-600">{i.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-5 mx-auto border border-green-500 px-4 py-2 rounded-lg text-green-700 flex items-center gap-2">
        💬 Need Help? Chat with Expert
      </button>
    </div>
  );
}
