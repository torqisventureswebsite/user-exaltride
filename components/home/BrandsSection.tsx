"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { fetchBrands } from "@/lib/api/brands";
import type { HomepageBrand } from "@/lib/api/products";

interface BrandsSectionProps {
  brands?: HomepageBrand[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  product_count?: number;
}

export function BrandsSection({ brands: propBrands }: BrandsSectionProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ SCROLL STATE
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 150;
    const scrollAmount = cardWidth * 5;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // ✅ FETCH BRANDS
  useEffect(() => {
    async function loadBrands() {
      try {
        if (propBrands && propBrands.length > 0) {
          const sorted = [...propBrands].sort(
            (a, b) => (b.product_count || 0) - (a.product_count || 0)
          );
          setBrands(sorted as Brand[]);
          return;
        }

        const apiBrands = await fetchBrands();
        const sorted = [...apiBrands].sort(
          (a, b) => (b.product_count || 0) - (a.product_count || 0)
        );

        setBrands(sorted);
      } catch (err) {
        console.error("Error loading brands:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBrands();
  }, [propBrands]);

  if (loading) {
    return (
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold mb-6 text-[#101828]">
            Top Brands
          </h2>
          <p className="text-gray-500 text-sm">Loading brands...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 md:py-16 overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-[#101828]">
            Top Brands
          </h2>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition
              ${
                canScrollLeft
                  ? "bg-white shadow-lg hover:bg-gray-100"
                  : "opacity-0 pointer-events-none"
              }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`hidden md:flex absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition
              ${
                canScrollRight
                  ? "bg-white shadow-lg hover:bg-gray-100"
                  : "opacity-0 pointer-events-none"
              }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth no-scrollbar pr-4 md:pr-6"
          >
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products/brand/${brand.slug}`}
                className="min-w-[100px] max-w-[100px]
                           md:min-w-[140px] md:max-w-[140px]
                           shrink-0 flex items-center justify-center
                           rounded-lg border border-gray-200 p-3 md:p-4
                           hover:border-blue-500 hover:shadow-md transition-all bg-white"
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg text-xl font-bold text-gray-600">
                    {brand.name.charAt(0)}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
