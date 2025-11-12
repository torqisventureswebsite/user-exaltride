import { getCartItems } from "@/lib/cart-actions";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutForm from "./CheckoutForm";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const cartItems = await getCartItems();

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    redirect("/cart");
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>
          <Link href="/cart">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="text-sm text-gray-700 flex-1">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (GST 18%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
