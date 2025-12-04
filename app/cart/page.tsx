import { getCartItems } from "@/lib/cart-actions";
import CartItem from "./CartItem";
import SimilarProducts from "@/components/cart/SimilarProducts";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartNavbar from "@/components/cart/CartNavbar";
import CartHeader from "@/components/cart/CartHeader";
import CartItemCard from "@/components/cart/CartItemCard";
import CartCouponBox from "@/components/cart/CartCouponBox";
import OrderSummary from "@/components/cart/OrderSummary";
import Footer from "@/components/layout/Footer";
import { ShoppingBag } from "lucide-react";
import CartTopBar from "@/components/cart/CartTopBar";  
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
    <CartNavbar cartCount={cartItems.length} />
    <CartTopBar />
    <div className="container mx-auto px-4 py-8">
      <CartHeader itemCount={cartItems.length} />

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItemCard key={item.productId} item={item} />

            ))}

            {/* CONTINUE SHOPPING BUTTON BELOW PRODUCTS */}
            <div className="pt-4">
              <Link href="/products">
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#052460] text-[#052460] rounded-xl font-semibold hover:bg-[#052460]/5 transition">
                  <ShoppingBag size={20} />
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE (Coupon + Summary) */}
          <div className="space-y-6">
            <CartCouponBox />

            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>

        </div>
      )}
    </div>

    {cartItems.length > 0 && (
      <SimilarProducts
        categoryIds={categoryIds}
        excludeProductIds={productIds}
      />
    )}

    <Footer />
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
