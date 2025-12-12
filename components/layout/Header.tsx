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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

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
              {/* Login/Profile with Dropdown */}
              {isAuthenticated ? (
                <div 
                  className="relative group"
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex flex-col items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <User size={22} className="mb-1" />
                    <span className="text-xs font-medium">{user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Account"}</span>
                  </button>
                  
                  {/* Dropdown Menu - pt-2 creates invisible hover bridge */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 top-full pt-0 z-50">
                      <div className="w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                        <button
                          onClick={() => {
                            router.push("/account");
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <User size={16} />
                          My Account
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="flex flex-col items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <User size={22} className="mb-1" />
                  <span className="text-xs">Login</span>
                </button>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex flex-col items-center justify-center text-gray-700 hover:text-gray-900 transition-colors p-2 -m-2"
              >
                <div className="relative mb-1">
                  <CartIcon />
                  <CartBadge count={cartCount} />
                </div>
                <span className="text-xs font-medium">Cart</span>
              </Link>

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
        <div className="flex items-center justify-between py-2 px-4">
          
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-gray-700"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/dark_logo.png"
                alt="ExaltRide Logo"
                width={85}
                height={18}
                priority
              />
            </Link>
          </div>

          {/* Right: User + Cart */}
          <div className="flex items-center gap-3">
            {/* User/Login with Dropdown */}
            {isAuthenticated ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 text-gray-700 cursor-pointer"
                >
                  <User size={20} />
                  <span className="text-xs font-medium max-w-[60px] truncate">
                    {user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Account"}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        router.push("/account");
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <User size={14} />
                      My Account
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center gap-1 text-gray-700 cursor-pointer"
              >
                <User size={20} />
                <span className="text-xs font-medium">Login</span>
              </button>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ShoppingBag size={22} />
              <CartBadge count={cartCount} />
            </Link>
          </div>

        </div>

        {/* Mobile Search Container */}
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

              {/* Account & Logout for authenticated users */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-white/10 my-3" />
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-2">
                    Account
                  </p>
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                      <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                        <User size={18} />
                      </div>
                      <span className="font-medium">My Account</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <div className="w-9 h-9 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <LogOut size={18} />
                    </div>
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              )}
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
