"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/components/product/ProductCard";

interface TopDealsSectionProps {
  products: Product[];
}

export function TopDealsSection({ products }: TopDealsSectionProps) {
  // ✅ Filter discounted products
  const topDeals = products.filter(
    (p) => p.discount_percentage && p.discount_percentage > 0
  );

  if (!topDeals || topDeals.length === 0) {
    return null;
  }

  // ✅ SCROLL STATE (SAME AS FEATURED)
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

    const cardWidth = 300; // ✅ matches Featured Products
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
    <section
      id="deals"
      className="border-t bg-white py-8 md:py-12 scroll-mt-20 overflow-x-hidden"
    >
      <div className="container mx-auto px-4">
        {/* ✅ Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#101828]">
              Top Deals
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Exclusive discounts for you
            </p>
          </div>

          <Link
            href="/products?type=deals"
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
            {topDeals.slice(0, 40).map((product) => (
              <div
                key={product.id}
                className="min-w-[280px] max-w-[280px] shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
