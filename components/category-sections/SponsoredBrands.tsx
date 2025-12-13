// components/category-sections/SponsoredBrands.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchBrands } from "@/lib/api/brands";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  product_count?: number;
}

export default function SponsoredBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const apiBrands = await fetchBrands();

        // ✅ Sort by product_count DESC and take top 4
        const topBrands = [...apiBrands]
          .sort((a, b) => (b.product_count || 0) - (a.product_count || 0))
          .slice(0, 4);

        setBrands(topBrands);
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
            <div
              key={i}
              className="bg-white p-5 rounded-xl border shadow-sm text-center animate-pulse"
            >
              <div className="h-12 w-12 bg-gray-200 rounded mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
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
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white p-5 rounded-xl border shadow-sm text-center"
          >
            {/* Brand Logo */}
            <div className="flex justify-center mb-3">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg text-lg font-bold text-gray-600">
                  {brand.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Brand Name */}
            <h3 className="font-semibold text-gray-900">
              {brand.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-500">
              {brand.description || "Premium Products"}
            </p>

            {/* CTA */}
            <Link
              href={`/products/brand/${brand.slug}`}
              className="mt-4 w-full py-1.5 text-sm border border-[#001F5F]
                         text-[#001F5F] rounded-lg hover:bg-[#001F5F]
                         hover:text-white transition block"
            >
              Explore
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
