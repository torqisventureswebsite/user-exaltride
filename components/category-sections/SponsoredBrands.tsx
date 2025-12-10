// components/category-sections/SponsoredBrands.tsx
import { Music, Headphones, Wrench } from "lucide-react";

export default function SponsoredBrands() {
  const brands = [
    { name: "Sony", desc: "Premium Audio Solutions", icon: <Music /> },
    { name: "Pioneer", desc: "Innovation in Sound", icon: <Headphones /> },
    { name: "Bosch", desc: "Quality You Trust", icon: <Wrench /> },
    { name: "JBL", desc: "Power & Performance", icon: <Headphones /> },
  ];

  return (
    // ✅ NO BORDER HERE ANYMORE
    <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#dbe2ee] to-[#f7f9fc]">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-800">
        <span>🎖</span>
        <span>Sponsored Brands</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {brands.map((b, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border shadow-sm text-center"
          >
            <div className="flex justify-center mb-3 text-[#001F5F]">
              {b.icon}
            </div>

            <h3 className="font-semibold text-gray-900">{b.name}</h3>
            <p className="text-xs text-gray-500">{b.desc}</p>

            <button className="mt-4 w-full py-1.5 text-sm border border-[#001F5F] text-[#001F5F] rounded-lg hover:bg-[#001F5F] hover:text-white transition">
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
