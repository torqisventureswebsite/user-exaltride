"use client";

import { Lock, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart/context";

interface PriceBoxProps {
  productId: string;
  title?: string;
  price?: number;
  image?: string;
  categoryId?: string;
  slug?: string;
  compareAt?: number | null;
}

export default function PriceBox({
  productId,
  title,
  price = 0,
  image,
  categoryId,
  slug,
  compareAt = null,
}: PriceBoxProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();

  const qty = getItemQuantity(productId);

  const discount =
    compareAt && price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : 0;

  const savings = compareAt ? compareAt - price : 0;

  const handleIncrement = () => {
    if (qty === 0) {
      addItem({
        productId,
        name: title || "",
        price,
        image: image || "",
        categoryId,
        slug,
      });
    } else {
      updateQuantity(productId, qty + 1);
    }
  };

  const handleDecrement = () => {
    if (qty > 0) {
      updateQuantity(productId, qty - 1);
    }
  };

  return (
    <div className="bg-[#F8FAFC] border rounded-xl p-4 space-y-3 shadow-sm">

      {/* PRICE ROW */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-2xl font-bold text-[#001F5F]">
          ₹{price.toLocaleString()}
        </span>

        {compareAt && (
          <span className="text-sm line-through text-gray-400">
            ₹{compareAt.toLocaleString()}
          </span>
        )}

        {discount > 0 && (
          <span className="bg-[#E6F0FF] text-[#0369A1] text-xs px-2 py-[2px] rounded font-semibold">
            {discount}% off
          </span>
        )}
      </div>

      {/* TAX INFO */}
      <p className="text-xs text-gray-500">Inclusive of all taxes</p>

      {/* SAVINGS */}
      {savings > 0 && (
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <Lock className="h-3 w-3" />
          <span>You save ₹{savings.toLocaleString()} on this purchase</span>
        </div>
      )}

      <hr />

      {/* QUANTITY CONTROL */}
      {/* <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Quantity:</span>

        <div className="flex items-center bg-[#FBC84C] rounded-md overflow-hidden">
          <button
            onClick={handleDecrement}
            disabled={qty === 0}
            className="w-10 h-9 flex items-center justify-center text-[#001F5F] hover:bg-yellow-500 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="w-10 text-center font-bold text-[#001F5F]">
            {qty}
          </span>

          <button
            onClick={handleIncrement}
            className="w-10 h-9 flex items-center justify-center text-[#001F5F] hover:bg-yellow-500"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div> */}

      {/* STOCK WARNING */}
      <p className="text-xs text-[#D97706] font-medium">
        Limited stock available!
      </p>
    </div>
  );
}
