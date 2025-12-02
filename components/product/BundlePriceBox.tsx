"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function BundlePriceBox({
  totalPrice,
  originalPrice,
  savings,
}: {
  totalPrice: number;
  originalPrice: number;
  savings: number;
}) {
  return (
    <div className="bg-blue-700 text-white p-5 rounded-xl mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-sm opacity-80">Complete Bundle Price</p>
        <h2 className="text-2xl font-bold">
          ₹{totalPrice.toLocaleString()}
          <span className="ml-3 line-through text-gray-300">
            ₹{originalPrice.toLocaleString()}
          </span>
        </h2>
        <p className="text-green-300 text-sm mt-1">✓ Save ₹{savings.toLocaleString()}</p>
      </div>

      <div className="flex gap-3">
        <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 flex items-center gap-2">
          <ShoppingCart size={16} /> Add All to Cart
        </Button>

        <Button variant="outline" className="text-black border-white">
          Customize Bundle
        </Button>
      </div>
    </div>
  );
}
