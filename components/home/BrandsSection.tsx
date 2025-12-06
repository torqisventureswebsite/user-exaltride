"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music, Headphones, Wrench } from "lucide-react";
import { fetchBrands } from "@/lib/api/brands";

// Map brand names to icons (fallback = Music)
const brandIcons: Record<string, any> = {
  Bosch: Wrench,
  JBL: Headphones,
  Pioneer: Headphones,
  Sony: Music,
  Philips: Music,
  Blaupunkt: Music,
};

export function BrandsSection() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const apiBrands = await fetchBrands();

        // Sort by product_count DESC
        const sorted = [...apiBrands].sort(
          (a, b) => (b.product_count || 0) - (a.product_count || 0)
        );

        // Top 6 brands
        setBrands(sorted.slice(0, 6));
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
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold mb-6">Top Brands</h2>
          <p className="text-gray-500 text-sm">Loading brands...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 md:py-16">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">Top Brands</h2>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
          {brands.map((brand) => {
            const Icon = brandIcons[brand.name] || Music;

            return (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 md:p-6 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <Icon className="h-8 w-8 md:h-10 md:w-10 text-gray-600 mb-2" />
                <span className="text-xs md:text-sm font-semibold text-gray-900 text-center">
                  {brand.name}
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 mt-1">
                  {brand.product_count} items
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
