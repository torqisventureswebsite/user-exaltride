"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Heart, ShoppingBag } from "lucide-react";
import SearchBar from "../layout/SearchBar";
import { CartBadge } from "@/components/cart/CartBadge";

interface CartNavbarProps {
  cartCount?: number;
}

export default function CartNavbar({ cartCount = 0 }: CartNavbarProps) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-[78px] gap-6">

          {/* LOGO */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/dark_logo.png"
              alt="ExaltRide"
              width={110}
              height={36}
              priority
            />
          </Link>

          {/* SEARCH BAR */}
          <div className="flex-1 max-w-3xl hidden md:block">
            <SearchBar />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-6">

            {/* ACCOUNT */}
            <button
              aria-label="Account"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
            >
              <User size={20} />
              <span className="text-sm font-medium hidden sm:inline">
                Account
              </span>
            </button>

            {/* WISHLIST */}
            <button
              aria-label="Wishlist"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
            >
              <Heart size={20} />
              <span className="text-sm font-medium hidden sm:inline">
                Wishlist
              </span>
            </button>

            {/* CART */}
            <button
              onClick={() => router.push("/cart")}
              aria-label="Cart"
              className="relative flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
            >
              <div className="relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1">
                  <CartBadge count={cartCount} />
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                Cart
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
