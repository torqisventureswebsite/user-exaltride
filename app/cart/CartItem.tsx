"use client";

import Image from "next/image";
import Link from "next/link";
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
    slug?: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) {
      // When quantity goes to 0, remove the item
      handleRemove();
      return;
    }
    
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
  <div className={`bg-white rounded-lg border p-4 transition-opacity ${isRemoving ? "opacity-50" : ""}`}>
    
    <div className="flex gap-4">
      
      {/* LEFT IMAGE */}
      <Link href={`/products/${item.slug || item.productId}`} className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden block">
        <Image 
          src={item.image || "/images/image1.jpg"}
          alt={item.name}
          fill
          className="object-cover hover:scale-105 transition-transform"
        />
      </Link>

      {/* RIGHT CONTENT */}
      <div className="flex-1">
        
        {/* TOP ROW: name + delete */}
        <div className="flex justify-between">
          <Link href={`/products/${item.slug || item.productId}`} className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 hover:text-blue-600 transition-colors">
            {item.name}
          </Link>

          <button 
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* PRICE */}
        <p className="text-gray-900 font-bold mt-1 text-base">
          ₹{item.price}
        </p>

        {/* QUANTITY + TOTAL */}
        <div className="mt-3 flex items-center justify-between">
          
          {/* QUANTITY */}
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button 
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isPending}
              className="px-3 py-1 text-gray-700 disabled:opacity-50"
            >
              -
            </button>

            <span className="px-4 py-1 text-gray-900 font-medium">
              {item.quantity}
            </span>

            <button 
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isPending}
              className="px-3 py-1 text-gray-700 disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* ITEM TOTAL */}
          <div className="text-right">
            <p className="text-xs text-gray-500">Item Total</p>
            <p className="text-sm font-bold text-gray-900">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
);

}
