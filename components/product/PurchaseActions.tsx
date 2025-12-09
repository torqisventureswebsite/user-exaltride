"use client";

import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { useState, useTransition } from "react";
import { addToCart } from "@/lib/cart-actions";
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

  // Check if item is in wishlist on mount
  useEffect(() => {
    const checkWishlist = async () => {
      const isIn = await isInWishlist(id);
      setInWishlist(isIn);
    };
    checkWishlist();
  }, [id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id || !title || !price) return;

    startTransition(async () => {
      const res = await addToCart(id, title, price, image || "", 1, categoryId);
      if (res.success) {
        setAdded(true);
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
    <div className="space-y-3">
      {/* Primary Buttons */}
      <div className="flex gap-2">
        <Button
          className={`flex-1 font-semibold ${
            added
              ? "bg-green-500 hover:bg-green-600 text-[#001F5F]"
              : "bg-[#FBC84C] text-[#001F5F] hover:bg-[#FBC84C]"
          }`}
          onClick={handleAddToCart}
          disabled={isPending}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {added ? "Added ✓" : "Add to cart"}
        </Button>

        <Button 
          className="flex-1 bg-[#001F5F]"
          onClick={handleBuyNow}
          disabled={isPending}
        >
          Buy Now
        </Button>
      </div>

      {/* Secondary Buttons */}
      {/* <div className="flex gap-2">
        <Button 
          variant="outline" 
          className={`flex-1 gap-2 ${inWishlist ? "text-red-500 border-red-500" : ""}`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-500" : ""}`} />
          {inWishlist ? "In Wishlist" : "Wishlist"}
        </Button>

        <Button 
          variant="outline" 
          className="flex-1 gap-2"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button> */}
      {/* </div> */}
    </div>
  );
}
