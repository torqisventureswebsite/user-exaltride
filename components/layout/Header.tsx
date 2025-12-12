"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import LocationSelector from "./LocationSelector";
import CartIcon from "./CartIcon";
import { User, Tag, Menu, X, ShoppingBag, MapPin, Car, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import CarSelector from "./CarSelector";
import { CartBadge } from "@/components/cart/CartBadge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { useCart } from "@/lib/cart/context";

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { count: cartCount } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll to deals section
  const scrollToDeals = () => {
    const dealsSection = document.getElementById("deals");
    if (dealsSection) {
      dealsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="
          container mx-auto 
          flex items-center justify-between 
          h-[78px] 
          px-6 gap-6 
          font-sans text-[15px] text-gray-800
        ">
          {/* Left: Logo + Add Car */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/dark_logo.png"
                alt="ExaltRide Logo"
                width={80}     // adjust size based on your design
                height={10}     // adjust accordingly
                priority
              />
            </Link>
            <CarSelector />
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 flex justify-center">
            <SearchBar />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-5">
            <LocationSelector />

            <div className="flex items-center gap-5">
              {/* Login/Profile */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push("/account")}
                    className="flex flex-col items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <User size={22} className="mb-1" />
                    <span className="text-xs font-medium">{user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Account"}</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex flex-col items-center justify-center text-gray-700 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={22} className="mb-1" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="flex flex-col items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User size={22} className="mb-1" />
                  <span className="text-xs">Login</span>
                </button>
              )}

              {/* Cart */}
              <button
              onClick={() => router.push("/cart")}
              className="relative flex flex-col items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              <div className="relative mb-1">
                <CartIcon />
                <CartBadge count={cartCount} />
              </div>
              <span className="text-xs font-medium">Cart</span>
            </button>

            </div>

            {/* Deals */}
            <Button
              onClick={scrollToDeals}
              className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors"
            >
              <Tag className="h-4 w-4" />
              Deals
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between py-0 px-4">
          
          {/* Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-gray-700"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo (Image, centered — matches Figma) */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/dark_logo.png"
              alt="ExaltRide Logo"
              width={95}
              height={20}
              priority
            />
          </Link>

          {/* Cart */}
          <button
            onClick={() => router.push("/cart")}
            className="relative p-1.5 text-gray-700"
          >
            <ShoppingBag size={22} />
            <CartBadge count={cartCount} />
          </button>

        </div>

        {/* Mobile Search Container (Figma blue border box style) */}
        <div className="px-4 pb-3">
            <SearchBar />
          
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-gradient-to-b from-[#001F5F] to-[#000B3D] z-50 shadow-2xl overflow-y-auto lg:hidden">
            {/* Header with Logo */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <Image 
                  src="/images/logo.png"
                  alt="ExaltRide Logo"
                  width={100}
                  height={30}
                  priority
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* User Section */}
            <div className="p-4">
              {isAuthenticated ? (
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <User size={24} className="text-[#001F5F]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user?.name?.split(" ")[0] || user?.email?.split("@")[0]}</p>
                      {user?.email && <p className="text-xs text-white/60">{user.email}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      router.push("/account");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-2 text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
                  >
                    <User size={16} />
                    <span>My Account</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    router.push("/auth/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-[#001F5F] font-semibold px-4 py-3.5 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-[#001F5F]/10 rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <span>Login / Sign Up</span>
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-4 grid grid-cols-1 gap-3">
              <div className="bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors">
                <CarSelector />
              </div>
              <div className="bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors">
                <LocationSelector />
              </div>
            </div>

            {/* Menu Items */}
            <nav className="px-4 space-y-1">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-2">
                Browse
              </p>
              
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={18} />
                  </div>
                  <span className="font-medium">All Products</span>
                </div>
              </Link>

              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center relative">
                    <ShoppingBag size={18} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#001F5F] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">My Cart</span>
                </div>
              </Link>

              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Wishlist</span>
                </div>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToDeals();
                }}
                className="w-full flex items-center gap-3 px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Tag size={18} className="text-yellow-400" />
                </div>
                <span className="font-medium">Deals & Offers</span>
                <span className="ml-auto bg-yellow-400 text-[#001F5F] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  HOT
                </span>
              </button>
            </nav>

            {/* Footer */}
            <div className="mt-auto p-4 border-t border-white/10 mt-6">
              <p className="text-xs text-white/40 text-center">
                © 2025 ExaltRide. All rights reserved.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Cart Sidebar
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
      /> */}
    </header>
  );
}
