"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeFromCart, updateCartQuantity } from "@/lib/cart-actions";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  categoryId?: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
}

export default function CartSidebar({ isOpen, onClose, items }: CartSidebarProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = 0; // Taxes already included in prices
  const total = subtotal + shipping;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-500">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartSidebarItem key={item.productId} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer with Totals and Checkout */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-yellow-600">FREE</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (GST 18%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-blue-50 text-blue-700 text-xs p-2 rounded-lg">
                  Add ₹{(999 - subtotal + 1).toFixed(2)} more for FREE shipping!
                </div>
              )}

              {/* Checkout Button */}
              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-base py-6">
                  Proceed to Checkout
                </Button>
              </Link>

              {/* View Cart Link */}
              <Link href="/cart" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  View Full Cart
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CartSidebarItem({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    startTransition(async () => {
      await updateCartQuantity(item.productId, newQuantity);
    });
  };

  const handleRemove = () => {
    setIsRemoving(true);
    startTransition(async () => {
      await removeFromCart(item.productId);
    });
  };

  return (
    <div
      className={`flex gap-3 bg-gray-50 p-3 rounded-lg transition-opacity ${
        isRemoving ? "opacity-50" : ""
      }`}
    >
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="text-sm font-bold text-gray-900 mb-2">₹{item.price.toFixed(2)}</div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isPending || item.quantity <= 1}
              className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 py-1 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isPending}
              className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-xs text-gray-600">
            Total: ₹{(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
