"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/context";
import { useAuth } from "@/lib/auth/context";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutContent() {
  const router = useRouter();
  const { items, isLoading } = useCart();
  const { isAuthenticated } = useAuth();

  // Redirect to cart if empty
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.push("/cart");
    }
  }, [items, isLoading, router]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F5F]"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>
        <Link href="/cart">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Cart</span>
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm 
            cartItems={items}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="text-sm text-gray-700 flex-1">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (GST 18%)</span>
                <span className="font-medium">₹{tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4">
              <ShieldCheck className="h-4 w-4 text-yellow-600" />
              <span>Secure checkout powered by PhonePe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
