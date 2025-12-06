"use client";

import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import type { Product } from "@/components/product/ProductCard";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 300; // card + gap
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
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  if (!products || products.length === 0) {
    return null;
  }

  const badges = [
    { primary: "Bestseller", secondary: "Limited Deal" },
    { primary: "Top Rated", secondary: "Deal of Day" },
    { primary: "Hot Deal", secondary: "Trending" },
    { primary: "New Launch", secondary: "Popular" },
  ];

  const featuredProducts = products.slice(0, 40).map((product, index) => ({
    product,
    badges: badges[index % badges.length] || {},
  }));

  return (
    <section className="border-t bg-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#101828]">
              Featured Products
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Handpicked selection
            </p>
          </div>

          <Link
            href="/products"
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

        {/* ✅ REAL HORIZONTAL SCROLLER */}
        <div className="relative">
          {/* LEFT ARROW */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* RIGHT ARROW */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pl-0 pr-10"
          >
            {featuredProducts.map(({ product, badges }) => (
              <div
                key={product.id}
                className="min-w-[280px] max-w-[280px] shrink-0"
              >
                <ProductCard product={product} badges={badges} showOffers />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
