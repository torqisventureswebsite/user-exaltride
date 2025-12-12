// components/cart/OrderSummary.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Truck, Wallet } from "lucide-react";

type CartItemShort = {
  productId: string;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
  compare_at_price?: number | null;
};

export default function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
}: {
  cartItems: CartItemShort[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  // ✅ Compute savings
  const originalTotal = cartItems.reduce((sum, it) => {
    const originalPrice = it.compare_at_price ?? it.price;
    return sum + originalPrice * (it.quantity ?? 1);
  }, 0);

  const saving = Math.max(0, originalTotal - subtotal);

  return (
    <aside className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
        {/* ✅ TITLE */}
        <h2 className="text-xs font-semibold tracking-wide text-gray-400 mb-4 uppercase">
          Order Summary
        </h2>

        {/* ✅ PRICE BREAKDOWN */}
        <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>
              Subtotal (
              {cartItems.reduce((s, i) => s + (i.quantity ?? 1), 0)} items)
            </span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span className="font-semibold text-yellow-500">FREE</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Taxes</span>
            <span className="italic text-gray-500">Included</span>
          </div>
        </div>

        {/* ✅ TOTAL */}
        <div className="mb-6">
          <div className="text-xs text-gray-400 uppercase mb-1">Total</div>
          <div className="text-3xl font-extrabold text-[#001F5F]">
            ₹{total.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">All taxes included</div>
        </div>

        {/* ✅ CHECKOUT BUTTON */}
        <Link href="/checkout">
          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-base py-4 shadow-md flex items-center justify-center gap-2">
            Proceed to Checkout →
          </Button>
        </Link>
      </div>
    </aside>
  );
}
