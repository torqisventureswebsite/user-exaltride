"use client";

import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { useState, useTransition } from "react";
import { addToCart, getCartCount } from "@/lib/cart-actions";
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/wishlist-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PurchaseActionsProps {
  id: string;
  title?: string;
  price?: number;
  image?: string;
  categoryId?: string;
  slug?: string;
  brand_name?: string;
  in_stock?: boolean;
}

export default function PurchaseActions({
  id,
  title,
  price,
  image,
  categoryId,
  slug,
  brand_name,
  in_stock,
}: PurchaseActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Load cart count and check wishlist on mount
  useEffect(() => {
    const loadData = async () => {
      const [isIn, count] = await Promise.all([
        isInWishlist(id),
        getCartCount()
      ]);
      setInWishlist(isIn);
      setCartCount(count);
    };
    loadData();

    // Poll for cart updates
    const interval = setInterval(async () => {
      const count = await getCartCount();
      setCartCount(count);
    }, 2000);

    return () => clearInterval(interval);
  }, [id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id || !title || !price) return;

    startTransition(async () => {
      const res = await addToCart(id, title, price, image || "", 1, categoryId);
      if (res.success) {
        setAdded(true);
        // Update cart count immediately
        const newCount = await getCartCount();
        setCartCount(newCount);
        toast.success("Added to cart!", {
          description: `${title} has been added to your cart`,
        });
        setTimeout(() => setAdded(false), 1500);
      } else {
        toast.error("Failed to add to cart", {
          description: "Please try again",
        });
      }
    });
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id || !title || !price) return;

    // Add to cart first
    const res = await addToCart(id, title, price, image || "", 1, categoryId);
    if (res.success) {
      toast.success("Added to cart!");
      // Navigate to cart page
      router.push("/cart");
    } else {
      toast.error("Failed to add to cart");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: title || "Check out this product",
      text: `${title} - ₹${price}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id || !title || !price) return;

    setWishlistLoading(true);

    try {
      if (inWishlist) {
        // Remove from wishlist
        const res = await removeFromWishlist(id);
        if (res.success) {
          setInWishlist(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error(res.message);
        }
      } else {
        // Add to wishlist
        const res = await addToWishlist(
          id,
          title,
          price,
          image || "",
          slug || "",
          brand_name,
          in_stock
        );
        if (res.success) {
          setInWishlist(true);
          toast.success("Added to wishlist!");
        } else {
          toast.error(res.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <>
      {/* Desktop/Tablet View */}
      <div className="space-y-3">
        {/* Primary Buttons */}
        <div className="flex gap-2">
          <Button
            className={`flex-1 font-semibold relative ${
              added
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-[#FBC84C] text-[#001F5F] hover:bg-[#FBC84C]"
            }`}
            onClick={handleAddToCart}
            disabled={isPending}
          >
            <div className="relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {cartCount > 0 && !added && (
                <span className="absolute -top-2 -right-1 bg-[#001F5F] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            {added ? "Added ✓" : `Add to cart${cartCount > 0 ? ` (${cartCount})` : ""}`}
          </Button>

          <Button 
            className="flex-1 bg-[#001F5F]"
            onClick={handleBuyNow}
            disabled={isPending}
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 z-50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Button
          className={`flex-1 font-semibold relative ${
            added
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-[#FBC84C] text-[#001F5F] hover:bg-[#FBC84C]"
          }`}
          onClick={handleAddToCart}
          disabled={isPending}
        >
          <div className="relative mr-2">
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && !added && (
              <span className="absolute -top-2 -right-2 bg-[#001F5F] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
          {added ? "Added ✓" : `Add to cart${cartCount > 0 ? ` (${cartCount})` : ""}`}
        </Button>

        <Button 
          className="flex-1 bg-[#001F5F]"
          onClick={handleBuyNow}
          disabled={isPending}
        >
          Buy Now
        </Button>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
