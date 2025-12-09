"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Product } from "@/components/product/ProductCard";
import { useCart } from "@/lib/cart/context";
import { useTransition } from "react";
import { Plus, Minus } from "lucide-react";

export default function MiniProductCard({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.id || !product.title || !product.price) return;

    startTransition(async () => {
      await addItem({
        productId: product.id,
        name: product.title || "",
        price: product.price || 0,
        image: product.primary_image || "/images/image1.jpg",
        categoryId: product.category_id,
        slug: product.slug,
      });
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await updateQuantity(product.id, quantityInCart + 1);
    });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await updateQuantity(product.id, quantityInCart - 1);
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

      {/* ADD BUTTON / QUANTITY CONTROLS */}
      {quantityInCart > 0 ? (
        <div className="w-full mt-2 flex items-center justify-center gap-2 bg-yellow-400 rounded-md py-1.5">
          <button
            onClick={handleDecrement}
            disabled={isPending}
            className="w-6 h-6 flex items-center justify-center text-black hover:bg-yellow-500 rounded transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-xs font-bold text-black min-w-[20px] text-center">
            {quantityInCart}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isPending}
            className="w-6 h-6 flex items-center justify-center text-black hover:bg-yellow-500 rounded transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <Button
          className="w-full mt-2 text-xs bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={handleAdd}
          disabled={isPending}
        >
          {isPending ? "Adding..." : "+ Add"}
        </Button>
      )}
    </div>
  );
}
