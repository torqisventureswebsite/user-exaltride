"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import LocationSelector from "./LocationSelector";
import CartIcon from "./CartIcon";
import { User, Tag, Menu, X, ShoppingBag, MapPin, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import CarSelector from "./CarSelector";
import { CartBadge } from "@/components/cart/CartBadge";
import CartSidebar from "@/components/cart/CartSidebar";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart data from API
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || []);
          setCartCount(data.count || 0);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCart();

    // Poll for cart updates every 2 seconds
    const interval = setInterval(loadCart, 2000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="container mx-auto flex items-center justify-between py-2.5 px-6 gap-5 font-sans text-[15px] text-gray-800">
          {/* Left: Logo + Add Car */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-blue-600">
              EXALTRIDE
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
              {/* Login */}
              <button className="flex flex-col items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
                <User size={22} className="mb-1" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex flex-col items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="relative mb-1">
                  <CartIcon />
                  <CartBadge count={cartCount} />
                </div>
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
      <div className="lg:hidden">
        <div className="flex items-center justify-between py-3 px-4">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-gray-900"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-lg font-bold text-blue-600">
            EXALTRIDE
          </Link>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-gray-900"
          >
            <ShoppingBag size={24} />
            <CartBadge count={cartCount} />
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto lg:hidden">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="space-y-4">
                {/* Login */}
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <User size={20} />
                  <span className="font-medium">Login / Sign Up</span>
                </button>

                {/* Add Car */}
                <div className="px-4 py-3">
                  <CarSelector />
                </div>

                {/* Location */}
                <div className="px-4 py-3">
                  <LocationSelector />
                </div>

                {/* Deals */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToDeals();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium transition-colors"
                >
                  <Tag size={20} />
                  <span>Deals & Offers</span>
                </button>

                {/* Divider */}
                <hr className="my-4 border-gray-200" />

                {/* Additional Links */}
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <ShoppingBag size={20} />
                    <span className="font-medium">All Products</span>
                  </button>
                </Link>

                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <ShoppingBag size={20} />
                    <span className="font-medium">My Cart</span>
                  </button>
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
      />
    </header>
  );
}
