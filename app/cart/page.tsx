import { getCartItems } from "@/lib/cart-actions";
import SimilarProducts from "@/components/cart/SimilarProducts";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartNavbar from "@/components/cart/CartNavbar";
import CartHeader from "@/components/cart/CartHeader";
import CartItemCard from "@/components/cart/CartItemCard";
import CartCouponBox from "@/components/cart/CartCouponBox";
import OrderSummary from "@/components/cart/OrderSummary";
import Footer from "@/components/layout/Footer";
import { ShoppingBag } from "lucide-react";
import CartTopBar from "@/components/cart/CartTopBar";
import FlashSaleBar from "@/components/cart/FlashSaleBar";
import { ProductCard } from "@/components/product/ProductCard";
import WishlistSection from "@/components/cart/WishlistSection";
import RecentlyViewedSection from "@/components/cart/RecentlyViewedSection";

export default async function CartPage() {
  const cartItems = await getCartItems();

  // Totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const categoryIds = Array.from(
    new Set(cartItems.map((item) => item.categoryId).filter(Boolean) as string[])
  );
  const productIds = cartItems.map((item) => item.productId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ NAVIGATION */}
      <CartNavbar cartCount={cartItems.length} />
      <CartTopBar />

      {/* ✅ CART HEADER */}
      <div className="container mx-auto px-4 pt-8">
        <CartHeader itemCount={cartItems.length} />
      </div>

      {/* ✅ FULL WIDTH FLASH BAR (CORRECT POSITION) */}
      <FlashSaleBar />

      {/* ✅ MAIN CART CONTENT */}
      <div className="container mx-auto px-4 pt-8 pb-8 flex-1">
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ✅ LEFT SIDE */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemCard key={item.productId} item={item} />
              ))}


            </div>

            {/* ✅ RIGHT SIDE */}
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

      {/* ✅ SIMILAR PRODUCTS */}
      {cartItems.length > 0 && (
        <SimilarProducts
          categoryIds={categoryIds}
          excludeProductIds={productIds}
        />
      )}
      {/* ✅ FROM YOUR WISHLIST SECTION */}
<WishlistSection />
<RecentlyViewedSection />
<div className="flex justify-center py-10">
  <Link href="/products">
    <button className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#052460] text-[#052460] rounded-xl font-semibold hover:bg-[#052460]/5 transition">
      <ShoppingBag size={20} />
      Continue Shopping
    </button>
  </Link>
</div>
      {/* ✅ FOOTER */}
      <Footer />
    </div>
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
          Start Shopping
        </Button>
      </Link>
    </div>
  );
}
