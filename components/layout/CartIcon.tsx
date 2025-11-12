"use client";

import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  return (
    <div className="relative flex items-center cursor-pointer hover:text-gray-900 transition-colors">
      <ShoppingCart className="h-5 w-5 text-gray-800" />
    </div>
  );
}
