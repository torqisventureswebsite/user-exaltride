"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

          <Link href="/products?type=trending">
            <Button className="bg-[#001F5F] hover:bg-blue-700 text-white px-6 py-2 text-sm md:text-base">
              View All Trending →
            </Button>
          </Link>
        </div>

        {/* ✅ REAL SCROLLER */}
        <div className="relative">
          {/* ✅ LEFT ARROW — hidden only at extreme left */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition
              ${
                canScrollLeft
                  ? "bg-white shadow-lg hover:bg-gray-100"
                  : "opacity-0 pointer-events-none"
              }
            `}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* ✅ RIGHT ARROW — hidden only at extreme right */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition
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
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pl-0 pr-6"
          >
            {trendingProducts.map((product, index) => (
              <div
                key={product.id}
                className="min-w-[280px] max-w-[280px] shrink-0 relative"
              >
                {/* ✅ RANK BADGE (#1, #2, etc.) */}
                <div className="absolute top-8 left-2 z-10 bg-[#001F5F] text-white text-xs font-bold px-2 py-1 rounded-full shadow">
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
