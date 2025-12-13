"use client";

import { useCart } from "@/lib/cart/context";
import CartHeader from "@/components/cart/CartHeader";
import CartItemCard from "@/components/cart/CartItemCard";
import CartCouponBox from "@/components/cart/CartCouponBox";
import OrderSummary from "@/components/cart/OrderSummary";
import SavedForLaterSection from "@/components/cart/SavedForLaterSection";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartContent() {
  const { items } = useCart();

  // Totals (prices are tax-inclusive)
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const tax = 0;
  const total = subtotal;

  if (items.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 pt-8">
          <CartHeader itemCount={0} />
        </div>
        <div className="container mx-auto px-4 pt-8 pb-8 flex-1">
          <EmptyCart />
          <SavedForLaterSection />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <CartHeader itemCount={items.length} />
      </div>

      <div className="container mx-auto px-4 pt-8 pb-8 flex-1">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.productId} item={item} />
            ))}
            
            {/* Saved for Later - below cart items */}
            <SavedForLaterSection />
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <OrderSummary
              cartItems={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
            {/* <CartCouponBox /> */}
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyCart() {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-600 mb-8">
        Add some products to get started!
      </p>
      <Link href="/">
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}
