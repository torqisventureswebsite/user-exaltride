"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Product } from "@/components/product/ProductCard";
import { addToCart } from "@/lib/cart-actions";
import { useState, useTransition } from "react";

export default function MiniProductCard({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.id || !product.title || !product.price) return;

    const image = product.primary_image || "/images/image1.jpg";

    startTransition(async () => {
      const res = await addToCart(
        product.id,
        product.title || "",
        product.price!,
        image,
        1,
        product.category_id
      );

      if (res.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }
    });
  };

  return (
    <div className="border rounded-xl bg-white shadow-sm hover:shadow-md transition p-3">
      {/* IMAGE */}
      <div className="relative w-full h-40 rounded-md overflow-hidden">
        <Image
          src={product.primary_image || "/images/image1.jpg"}
          alt={product.title || "Product"}
          fill
          className="object-cover"
        />
      </div>

      {/* TITLE */}
      <h4 className="text-xs font-medium mt-2 line-clamp-2">
        {product.title}
      </h4>

      {/* PRICE */}
      <p className="text-sm font-semibold text-blue-600 mt-1">
        ₹{product.price?.toLocaleString()}
      </p>

      {/* ADD BUTTON (same behavior as main card) */}
      <Button
        className={`w-full mt-2 text-xs ${
          added
            ? "bg-yellow-50 text-yellow-600 border-yellow-500"
            : "bg-yellow-400 hover:bg-yellow-500 text-black"
        }`}
        onClick={handleAdd}
        disabled={isPending}
      >
        {isPending ? "Adding..." : added ? "Added ✓" : "+ Add"}
      </Button>
    </div>
  );
}
