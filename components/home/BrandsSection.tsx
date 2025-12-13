"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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

  // SCROLL STATE
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* ---------------- FETCH BRANDS ---------------- */
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

  /* ---------------- DUPLICATE FOR AUTO SCROLL (only if 6+ brands) ---------------- */
  const scrollBrands = useMemo(() => {
    if (brands.length >= 6) {
      return [...brands, ...brands];
    }
    return brands;
  }, [brands]);

  /* ---------------- CHECK SCROLL (ARROWS) ---------------- */
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
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

  /* ---------------- MANUAL SCROLL ---------------- */
  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    const el = scrollRef.current;
    // Only auto-scroll if we have 6+ brands (duplicated for infinite scroll)
    if (!el || brands.length < 6) return;

    const speed = 0.6; // smooth + visible

    const autoScroll = () => {
      if (!isHoveringRef.current) {
        el.scrollLeft += speed;

        // reset at halfway because list is duplicated
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }

      autoScrollRef.current = requestAnimationFrame(autoScroll);
    };

    autoScrollRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [brands.length]);

  /* ---------------- LOADING ---------------- */
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

  /* ---------------- UI ---------------- */
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
            onMouseEnter={() => (isHoveringRef.current = true)}
            onMouseLeave={() => (isHoveringRef.current = false)}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pr-4 md:pr-6"
          >
            {scrollBrands.map((brand, index) => (
              <Link
                key={`${brand.id}-${index}`}
                href={`/products/brand/${brand.slug}`}
                className="min-w-[160px] max-w-[160px]
                           md:min-w-[200px] md:max-w-[200px]
                           shrink-0 flex items-center justify-center
                           rounded-lg border border-gray-200 p-4
                           hover:border-blue-500 hover:shadow-md transition-all bg-white"
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={90}
                    height={60}
                    className="object-contain"
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
