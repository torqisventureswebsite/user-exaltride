"use client";

import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
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
  };
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const [isPending, startTransition] = useTransition();
  const [removing, setRemoving] = useState(false);

  const handleQty = (newQty: number) => {
    if (newQty < 1) return;

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
      className={`bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex gap-4 transition ${
        removing ? "opacity-50" : ""
      }`}
    >
      {/* IMAGE */}
      <div className="relative w-28 h-28 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={item.image || "/images/image1.jpg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1 flex flex-col justify-between">

        {/* TOP SECTION */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold text-gray-900 text-[15px] leading-tight line-clamp-2">
              {item.name}
            </h2>

            {/* Dummy static details (same as Figma) */}
            <p className="text-xs text-gray-500 mt-1">
              Fitment details unavailable
            </p>

            <p className="text-xs text-gray-500">
              Sold by:{" "}
              <span className="text-blue-600 font-medium">
                ExaltRide Seller
              </span>
            </p>

            {/* DELIVERY */}
            <div className="mt-1 flex items-center gap-2">
              <div className="bg-gray-100 text-gray-700 text-xs px-2 py-[2px] rounded-md">
                Delivery in 2–3 days
              </div>
            </div>
          </div>

          {/* PRICE */}
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">₹{item.price}</p>

            {/* No compare_at_price → hide original price */}
            <p className="text-xs line-through text-gray-400 opacity-0">₹0</p>

            {/* Discount pill (static placeholder for now) */}
            <div className="bg-green-100 text-green-700 text-[11px] px-2 py-[1px] mt-1 font-semibold rounded-md">
              Best Price
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-3 flex justify-between items-center">

          {/* QUANTITY */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Quantity:</span>

            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                disabled={isPending || item.quantity <= 1}
                onClick={() => handleQty(item.quantity - 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
              >
                −
              </button>

              <span className="px-4 py-1 text-sm font-medium">
                {item.quantity}
              </span>

              <button
                disabled={isPending}
                onClick={() => handleQty(item.quantity + 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 text-sm">
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              <Heart size={15} />
              Save for Later
            </button>

            <button
              onClick={handleRemove}
              disabled={isPending}
              className="flex items-center gap-1 text-red-600 hover:text-red-800"
            >
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
