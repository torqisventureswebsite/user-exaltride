"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, Truck } from "lucide-react";
import { updateCartQuantity, removeFromCart } from "@/lib/cart-actions";
import { useTransition, useState } from "react";

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

  const handleQty = (newQty: number) => {
    if (newQty < 1) {
      // When quantity goes to 0, remove the item
      handleRemove();
      return;
    }
    startTransition(async () => {
      await updateCartQuantity(item.productId, newQty);
    });
  };

  const handleRemove = () => {
    setRemoving(true);
    startTransition(async () => {
      await removeFromCart(item.productId);
    });
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-5 border border-gray-200 transition ${
        removing ? "opacity-50" : ""
      }`}
    >
      <div className="flex gap-5">
        {/* ✅ IMAGE */}
        <Link href={`/products/${item.slug || item.productId}`} className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 block">
          <Image
            src={item.image || "/images/image1.jpg"}
            alt={item.name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </Link>

        {/* ✅ RIGHT CONTENT */}
        <div className="flex-1 flex flex-col justify-between">
          {/* ✅ TOP SECTION */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <Link href={`/products/${item.slug || item.productId}`} className="font-semibold text-gray-900 text-[16px] leading-tight hover:text-blue-600 transition-colors">
                {item.name}
              </Link>

              <p className="text-sm text-gray-500 mt-1">
                For: <span className="font-medium">Fits Hyundai Creta 2019–2023, all variants</span>
              </p>

              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-gray-500">Sold by:</span>
                <span className="text-blue-600 font-medium">AutoShield Official</span>
                <span className="ml-2 bg-blue-900 text-white text-xs px-2 py-[2px] rounded-md font-semibold">
                  ★ 4.7
                </span>
              </div>

              {/* ✅ DELIVERY BADGE */}
              <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-lg">
                <Truck size={16} />
                Delivery in 2–3 days
              </div>
            </div>

            {/* ✅ PRICE BLOCK */}
            <div className="text-right flex flex-col items-end">
              <p className="text-2xl font-bold text-[#001F5F]">₹{item.price}</p>

              {/* <p className="text-sm text-gray-400 line-through">₹4,999</p> */}

              {/* <span className="mt-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-md">
                50% OFF
              </span> */}
            </div>
          </div>

          {/* ✅ DIVIDER */}
          <div className="my-4 border-t border-gray-200" />

          {/* ✅ BOTTOM ROW */}
          <div className="flex justify-between items-center">
            {/* ✅ QUANTITY */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>

              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  disabled={isPending}
                  onClick={() => handleQty(item.quantity - 1)}
                  className="w-10 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                >
                  −
                </button>

                <span className="w-12 text-center font-semibold">
                  {item.quantity}
                </span>

                <button
                  disabled={isPending}
                  onClick={() => handleQty(item.quantity + 1)}
                  className="w-10 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* ✅ ACTION BUTTONS */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                <Heart size={16} />
                Save for Later
              </button>

              <button
                onClick={handleRemove}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
