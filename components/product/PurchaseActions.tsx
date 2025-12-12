"use client";

import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart/context";
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/wishlist-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { addItem, updateQuantity, getItemQuantity, count: cartCount } = useCart();
  const quantityInCart = getItemQuantity(id);

  // Check wishlist on mount
  useEffect(() => {
    const loadWishlist = async () => {
      const isIn = await isInWishlist(id);
      setInWishlist(isIn);
    };
    loadWishlist();
  }, [id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id || !title || !price) return;

    try {
      addItem({
        productId: id,
        name: title,
        price: price,
        image: image || "",
        categoryId,
        slug,
      });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(id, quantityInCart - 1);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id || !title || !price) return;

    try {
      if (quantityInCart === 0) {
        await addItem({
          productId: id,
          name: title,
          price: price,
          image: image || "",
          categoryId,
          slug,
        });
      }
      router.push("/cart");
    } catch (error) {
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
          {quantityInCart > 0 ? (
            <div className="flex-1 flex items-center justify-center gap-3 bg-[#FBC84C] rounded-md h-10">
              <button
                onClick={handleDecrement}
                className="w-10 h-10 flex items-center justify-center text-[#001F5F] hover:bg-yellow-600 rounded-l-md transition-colors"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-lg font-bold text-[#001F5F] min-w-[32px] text-center">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                className="w-10 h-10 flex items-center justify-center text-[#001F5F] hover:bg-yellow-600 rounded-r-md transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Button
              className="flex-1 font-semibold bg-[#FBC84C] text-[#001F5F] hover:bg-[#FBC84C]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to cart
            </Button>
          )}

          <Button 
            className="flex-1 bg-[#001F5F]"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 z-50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {quantityInCart > 0 ? (
          <div className="flex-1 flex items-center justify-center gap-3 bg-[#FBC84C] rounded-md h-10">
            <button
              onClick={handleDecrement}
              className="w-10 h-10 flex items-center justify-center text-[#001F5F] hover:bg-yellow-600 rounded-l-md transition-colors"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="text-lg font-bold text-[#001F5F] min-w-[32px] text-center">
              {quantityInCart}
            </span>
            <button
              onClick={handleIncrement}
              className="w-10 h-10 flex items-center justify-center text-[#001F5F] hover:bg-yellow-600 rounded-r-md transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <Button
            className="flex-1 font-semibold bg-[#FBC84C] text-[#001F5F] hover:bg-[#FBC84C]"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to cart
          </Button>
        )}

        <Button 
          className="flex-1 bg-[#001F5F]"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
