import { getCartItems } from "@/lib/cart-actions";
import CartItem from "./CartItem";
import SimilarProducts from "@/components/cart/SimilarProducts";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CartPage() {
  const cartItems = await getCartItems();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  // Get unique category IDs for similar products
  const categoryIds = Array.from(
    new Set(cartItems.map((item) => item.categoryId).filter(Boolean) as string[])
  );
  const productIds = cartItems.map((item) => item.productId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

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

                {shipping > 0 && (
                  <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg mb-4">
                    Add ₹{(999 - subtotal + 1).toFixed(2)} more to get FREE shipping!
                  </div>
                )}

                <Link href="/checkout">
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg py-6">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">Secure checkout powered by ExaltRide</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Similar Products Section */}
      {cartItems.length > 0 && (
        <SimilarProducts categoryIds={categoryIds} excludeProductIds={productIds} />
      )}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-600 mb-8">Add some products to get started!</p>
      <Link href="/">
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
          Start Shopping
        </Button>
      </Link>
    </div>
  );
}
