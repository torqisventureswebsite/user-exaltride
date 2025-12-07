"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewProductCard } from "@/components/product/NewProductCard";
import type { Product } from "@/components/product/ProductCard";
import { fetchAllProducts } from "@/lib/api/products";

export default function RecentlyViewedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ✅ TEMP: Using products for now (replace later with recently viewed logic)
  useEffect(() => {
    async function loadProducts() {
      const data = await fetchAllProducts();
      setProducts(data.slice(20, 40)); // Different slice so it doesn't duplicate wishlist
    }
    loadProducts();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -900 : 900, behavior: "smooth" });
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  if (!products.length) return null;

  return (
    <section className="bg-white py-8 md:py-12 border-t">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-lg md:text-xl font-bold text-[#101828]">
          Recently Viewed
        </h2>

        <div className="relative">
          {/* LEFT ARROW */}
          <button
            onClick={() => scroll("left")}
            className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 bg-white shadow
              ${canScrollLeft ? "" : "opacity-0 pointer-events-none"}
            `}
          >
            <ChevronLeft />
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={() => scroll("right")}
            className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 bg-white shadow
              ${canScrollRight ? "" : "opacity-0 pointer-events-none"}
            `}
          >
            <ChevronRight />
          </button>

          {/* ✅ PRODUCT ROW */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pr-6"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-[190px] max-w-[190px] shrink-0"
              >
                <NewProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
