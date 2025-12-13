"use client";

import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import type { Product } from "@/components/product/ProductCard";
import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, Car } from "lucide-react";
import { useCarProducts, type CarProduct } from "@/lib/hooks/useCarProducts";
import { useCar } from "@/lib/car/context";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products: initialProducts }: FeaturedProductsProps) {
  const { selectedCar } = useCar();
  const { products: rawProducts, isLoading, hasCarFilter } = useCarProducts({
    endpoint: "products/featured",
    limit: 40,
    initialProducts: initialProducts as CarProduct[],
  });

  // Sort products: compatible ones first when a car is selected
  const products = useMemo(() => {
    if (!selectedCar) return rawProducts;
    
    const checkCompatibility = (product: CarProduct): boolean => {
      if (product.is_universal) return true;
      if (!product.compatible_cars || !Array.isArray(product.compatible_cars)) return false;
      
      return product.compatible_cars.some(car =>
        car.make.toLowerCase() === selectedCar.make.toLowerCase() &&
        car.model.toLowerCase() === selectedCar.model.toLowerCase() &&
        car.year === selectedCar.year
      );
    };

    return [...rawProducts].sort((a, b) => {
      const aCompatible = checkCompatibility(a);
      const bCompatible = checkCompatibility(b);
      if (aCompatible && !bCompatible) return -1;
      if (!aCompatible && bCompatible) return 1;
      return 0;
    });
  }, [rawProducts, selectedCar]);

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
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#101828]">
                Featured Products
              </h2>
              <p className="text-xs md:text-sm text-gray-600">
                {hasCarFilter ? "Products for your car" : "Handpicked selection"}
              </p>
            </div>
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            )}
            {hasCarFilter && !isLoading && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                <Car className="h-3 w-3" />
                Filtered
              </span>
            )}
          </div>

          <Link
            href={"/collections/featured" as any}
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
          {/* LEFT ARROW - Hidden on mobile */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute -left-4 top-1/2 z-10 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* RIGHT ARROW - Hidden on mobile */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute -right-4 top-1/2 z-10 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth no-scrollbar pr-4 md:pr-10"
          >
            {featuredProducts.map(({ product, badges }) => (
              <div
                key={product.id}
                className="min-w-[150px] max-w-[150px] md:min-w-[280px] md:max-w-[280px] shrink-0"
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
