"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewProductCard } from "@/components/product/NewProductCard";
import type { Product } from "@/components/product/ProductCard";
import { useWishlist } from "@/lib/wishlist/context";

export default function WishlistSection() {
  const { items } = useWishlist();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Map wishlist items to Product format for NewProductCard
  const products: Product[] = items.map((item) => ({
    id: item.productId,
    title: item.title,
    price: item.price,
    primary_image: item.image,
    slug: item.slug || item.productId,
    brand_name: item.brand_name,
    in_stock: item.in_stock ?? true,
    compare_at_price: undefined,
    discount_percentage: undefined,
  }));

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
          From Your Wishlist
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

          {/* PRODUCT ROW */}
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
