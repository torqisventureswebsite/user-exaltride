// components/category-sections/BuyingGuide.tsx
import { Info } from "lucide-react";

export default function BuyingGuide() {
  const items = [
    {
      id: 1,
      title: "Check Compatibility",
      desc: "Ensure the system fits your car model and dashboard size",
    },
    {
      id: 2,
      title: "Features",
      desc: "Look for Android Auto, CarPlay, GPS, and Bluetooth connectivity",
    },
    {
      id: 3,
      title: "Screen Quality",
      desc: "Higher resolution screens provide better visibility",
    },
    {
      id: 4,
      title: "Installation",
      desc: "Check if professional installation is included or required",
    },
  ];

  return (
   
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#dbe2ee] to-[#f7f9fc] border">
      <h2 className="font-semibold text-sm flex items-center gap-2 mb-4 text-gray-900">
        <Info className="h-4 w-4 text-[#001F5F]" />
        Buying Guide: How to Choose the Right Audio System
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-start gap-3 bg-white p-4 rounded-xl border shadow-sm"
          >
            {/* NUMBER BADGE */}
            <div className="h-7 w-7 rounded-full bg-[#f3f6fb] border border-[#001F5F] flex items-center justify-center text-[#001F5F] font-semibold text-xs">
              {i.id}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {i.title}
              </h3>
              <p className="text-xs text-gray-500">{i.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* OUTLINED NAVY BUTTON (not yellow) */}
      <div className="flex justify-center">
        <button className="mt-5 px-4 py-2 text-sm border border-[#001F5F] text-[#001F5F] rounded-lg hover:bg-[#001F5F] hover:text-white transition flex items-center gap-2">
          💬 Need Help? Chat with Expert
        </button>
      </div>
    </div>
  );
}
