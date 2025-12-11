// components/category-sections/SponsoredBrands.tsx
"use client";

import { useEffect, useState } from "react";
import { Music, Headphones, Wrench, Cpu } from "lucide-react";
import Link from "next/link";
import { fetchBrands } from "@/lib/api/brands";

// Map brand names to icons (fallback = Music)
const brandIcons: Record<string, any> = {
  Bosch: Wrench,
  JBL: Headphones,
  Pioneer: Headphones,
  Sony: Music,
  Philips: Cpu,
  Blaupunkt: Music,
  Kenwood: Headphones,
};

// Brand descriptions
const brandDescriptions: Record<string, string> = {
  Bosch: "Quality You Trust",
  JBL: "Power & Performance",
  Pioneer: "Innovation in Sound",
  Sony: "Premium Audio Solutions",
  Philips: "Smart Technology",
  Blaupunkt: "German Engineering",
  Kenwood: "Audio Excellence",
};

export default function SponsoredBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const apiBrands = await fetchBrands();
        // Sort by product_count and take top 4
        const sorted = [...apiBrands]
          .sort((a, b) => (b.product_count || 0) - (a.product_count || 0))
          .slice(0, 4);
        setBrands(sorted);
      } catch (err) {
        console.error("Error loading brands:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBrands();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#dbe2ee] to-[#f7f9fc]">
        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-800">
          <span>🎖</span>
          <span>Sponsored Brands</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl border shadow-sm text-center animate-pulse">
              <div className="h-6 w-6 bg-gray-200 rounded mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24 mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#dbe2ee] to-[#f7f9fc]">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-800">
        <span>🎖</span>
        <span>Sponsored Brands</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {brands.map((brand) => {
          const Icon = brandIcons[brand.name] || Music;
          const description = brandDescriptions[brand.name] || brand.description || "Premium Products";

          return (
            <div
              key={brand.id}
              className="bg-white p-5 rounded-xl border shadow-sm text-center"
            >
              <div className="flex justify-center mb-3 text-[#001F5F]">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="font-semibold text-gray-900">{brand.name}</h3>
              <p className="text-xs text-gray-500">{description}</p>

              <Link 
                href={`/products/brand/${brand.slug}` as any}
                className="mt-4 w-full py-1.5 text-sm border border-[#001F5F] text-[#001F5F] rounded-lg hover:bg-[#001F5F] hover:text-white transition block"
              >
                Explore
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
