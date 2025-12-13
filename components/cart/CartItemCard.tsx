"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, Truck } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useWishlist } from "@/lib/wishlist/context";
import { useTransition, useState } from "react";
import { toast } from "sonner";

interface CartItemCardProps {
  item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    categoryId?: string;
    slug?: string;
  };
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const [isPending, startTransition] = useTransition();
  const [removing, setRemoving] = useState(false);
  const { updateQuantity, removeItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const handleQty = (newQty: number) => {
    if (newQty < 1) {
      // When quantity goes to 0, remove the item
      handleRemove();
      return;
    }
    startTransition(async () => {
      await updateQuantity(item.productId, newQty);
    });
  };

  const handleRemove = () => {
    setRemoving(true);
    startTransition(async () => {
      await removeItem(item.productId);
    });
  };

  const handleSaveToWishlist = async () => {
    await toggleItem({
      productId: item.productId,
      title: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug,
    });
    
    if (isInWishlist(item.productId)) {
      toast.success("Removed from wishlist");
    } else {
      removeItem(item.productId);
      toast.success("Saved to wishlist!");
    }
  };

  return (
    <div
      className={`bg-white rounded-xl md:rounded-2xl shadow-sm p-3 md:p-5 border border-gray-200 transition ${
        removing ? "opacity-50" : ""
      }`}
    >
      <div className="flex gap-3 md:gap-5">
        {/* ✅ IMAGE */}
        <Link href={`/products/${item.slug || item.productId}`} className="relative w-30 h-30 md:w-32 md:h-32 rounded-lg md:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 block">
          <Image
            src={item.image || "/images/image1.jpg"}
            alt={item.name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </Link>

        {/* ✅ RIGHT CONTENT */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* ✅ TOP SECTION */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-4">
            <div className="min-w-0">
              <Link href={`/products/${item.slug || item.productId}`} className="font-semibold text-gray-900 text-sm md:text-[16px] leading-tight hover:text-blue-600 transition-colors line-clamp-2">
                {item.name}
              </Link>

              <p className="text-xs md:text-sm text-gray-500 mt-1 hidden md:block">
                For: <span className="font-medium">Fits Hyundai Creta 2019–2023, all variants</span>
              </p>

              <div className="hidden md:flex items-center gap-2 text-sm mt-1">
                <span className="text-gray-500">Sold by:</span>
                <span className="text-blue-600 font-medium">AutoShield Official</span>
                <span className="ml-2 bg-blue-900 text-white text-xs px-2 py-[2px] rounded-md font-semibold">
                  ★ 4.7
                </span>
              </div>

            </div>

            {/* ✅ PRICE BLOCK */}
            <div className="text-left md:text-right flex md:flex-col items-center md:items-end gap-2 md:gap-0">
              <p className="text-lg md:text-2xl font-bold text-[#001F5F]">₹{item.price.toLocaleString()}</p>
            </div>
          </div>

          {/* ✅ DIVIDER */}
          <div className="my-2 md:my-4 border-t border-gray-200" />

          {/* ✅ BOTTOM ROW */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* ✅ QUANTITY */}
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xs md:text-sm font-medium text-gray-700">
                Qty:
              </span>

              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  disabled={isPending}
                  onClick={() => handleQty(item.quantity - 1)}
                  className="w-8 h-8 md:w-10 md:h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm md:text-base"
                >
                  −
                </button>

                <span className="w-8 md:w-12 text-center font-semibold text-sm md:text-base">
                  {item.quantity}
                </span>

                <button
                  disabled={isPending}
                  onClick={() => handleQty(item.quantity + 1)}
                  className="w-8 h-8 md:w-10 md:h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm md:text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* ✅ ACTION BUTTONS */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={handleSaveToWishlist}
                className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 border rounded-lg text-gray-700 hover:bg-gray-50 text-xs md:text-sm font-medium"
              >
                <Heart size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Save to wishlist</span>
              </button>

              <button
                onClick={handleRemove}
                disabled={isPending}
                className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-xs md:text-sm font-medium"
              >
                <Trash2 size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
