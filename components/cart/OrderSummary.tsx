// components/cart/OrderSummary.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  // Compute "you're saving" from compare_at_price if available
  const originalTotal = cartItems.reduce((sum, it) => {
    const originalPrice = it.compare_at_price ?? it.price;
    return sum + originalPrice * (it.quantity ?? 1);
  }, 0);

  const saving = Math.max(0, originalTotal - subtotal);

  return (
    <aside className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal ({cartItems.reduce((s, i) => s + (i.quantity ?? 1), 0)} items)</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Taxes</span>
            <span className="font-medium">₹{tax.toFixed(2)}</span>
          </div>
        </div>

        {/* You're saving pill */}
        <div className="mb-4">
          <div className="bg-green-50 rounded-lg py-3 px-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">You're saving</div>
            <div className="text-sm font-semibold text-green-800">₹{saving.toFixed(2)}</div>
          </div>
        </div>

        {/* Total */}
        <div className="mb-6">
          <div className="text-2xl font-extrabold text-indigo-900">₹{total.toFixed(2)}</div>
          <div className="text-xs text-gray-400">All taxes included</div>
        </div>

        <Link href="/checkout">
          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg py-4 shadow-md">
            Proceed to Checkout
          </Button>
        </Link>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>100% Secure Payments</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Fast & Reliable Delivery</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Multiple Payment Options</span>
          </div>
        </div>

        {/* Payment icons - placeholders */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {/* Replace src with your small payment icons if available */}
          <div className="border rounded px-2 py-1 text-xs text-gray-600">VISA</div>
          <div className="border rounded px-2 py-1 text-xs text-gray-600">Mastercard</div>
          <div className="border rounded px-2 py-1 text-xs text-gray-600">UPI</div>
          <div className="border rounded px-2 py-1 text-xs text-gray-600">Wallet</div>
          <div className="border rounded px-2 py-1 text-xs text-gray-600">COD</div>
        </div>
      </div>
    </aside>
  );
}
