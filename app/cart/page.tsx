"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { ShoppingBag } from "lucide-react";
import FlashSaleBar from "@/components/cart/FlashSaleBar";
import WishlistSection from "@/components/cart/WishlistSection";
import RecentlyViewedSection from "@/components/cart/RecentlyViewedSection";
import CartContent from "@/components/cart/CartContent";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <TopBar />

      <CartContent />

      {/* <FlashSaleBar /> */}

      <WishlistSection />
      <RecentlyViewedSection />
      
      <div className="flex justify-center py-10">
        <Link href="/">
          <button className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#052460] text-[#052460] rounded-xl font-semibold hover:bg-[#052460]/5 transition">
            <ShoppingBag size={20} />
            Continue Shopping
          </button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
