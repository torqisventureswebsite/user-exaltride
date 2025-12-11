"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/components/product/ProductCard";

interface TrendingSectionProps {
  products: Product[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // ✅ take more items for scroll (not 4)
  const trendingProducts = products.slice(0, 40);

  // ✅ SCROLL STATE (same as Featured/Top Deals)
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

    const cardWidth = 300; // ✅ same as Featured & Top Deals
    const scrollAmount = cardWidth * 3;

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

  return (
    <section className="bg-gray-50 py-8 md:py-16 overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* ✅ Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl md:text-3xl">🔥</span>
              <h2 className="text-xl md:text-3xl font-bold text-[#101828]">
                Trending This Week
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              Hot picks that car enthusiasts are loving right now
            </p>
          </div>

          <Link
            href={"/collections/trending" as any}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base"
          >
            View all
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* ✅ REAL SCROLLER */}
        <div className="relative">
          {/* ✅ LEFT ARROW — hidden on mobile and at extreme left */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition
              ${
                canScrollLeft
                  ? "bg-white shadow-lg hover:bg-gray-100"
                  : "opacity-0 pointer-events-none"
              }
            `}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* ✅ RIGHT ARROW — hidden on mobile and at extreme right */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`hidden md:flex absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition
              ${
                canScrollRight
                  ? "bg-white shadow-lg hover:bg-gray-100"
                  : "opacity-0 pointer-events-none"
              }
            `}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* ✅ SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-6 overflow-x-auto scroll-smooth no-scrollbar pr-4 md:pr-6"
          >
            {trendingProducts.map((product, index) => (
              <div
                key={product.id}
                className="min-w-[150px] max-w-[150px] md:min-w-[280px] md:max-w-[280px] shrink-0 relative"
              >
                {/* ✅ RANK BADGE (#1, #2, etc.) */}
                <div className="absolute top-6 md:top-8 left-1 md:left-2 z-10 bg-[#001F5F] text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full shadow">
                  #{index + 1}
                </div>

                <ProductCard product={product} showOffers />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
