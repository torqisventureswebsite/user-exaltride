"use client";

export default function CartHeader({ itemCount }: { itemCount: number }) {
  return (
    <div className="flex items-center justify-between py-4 px-2 mb-6 border-b border-gray-200">
      {/* LEFT */}
      <div>
        <h1 className="text-3xl font-bold text-[#001f4d]">Your Cart</h1>
        <p className="text-gray-500 text-sm mt-1">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {/* RIGHT - Secure Checkout Badge */}
      <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-200 text-sm">
        <span className="text-yellow-600">◉</span>
        <span className="font-medium">100% Secure Checkout</span>
      </div>
    </div>
  );
}
