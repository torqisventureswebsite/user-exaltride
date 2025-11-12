"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCartQuantity, removeFromCart } from "@/lib/cart-actions";
import { useState, useTransition } from "react";

interface CartItemProps {
  item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    categoryId?: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    startTransition(async () => {
      await updateCartQuantity(item.productId, newQuantity);
    });
  };

  const handleRemove = () => {
    setIsRemoving(true);
    startTransition(async () => {
      await removeFromCart(item.productId);
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 md:p-6 transition-opacity ${
        isRemoving ? "opacity-50" : ""
      }`}
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4 mb-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2">
              {item.name}
            </h3>
            <button
              onClick={handleRemove}
              disabled={isPending}
              className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
              aria-label="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
            {/* Price */}
            <div className="text-xl font-bold text-gray-900">
              ₹{item.price.toFixed(2)}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 mr-2">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={isPending || item.quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={isPending}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Item Total</p>
              <p className="text-lg font-bold text-gray-900">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
