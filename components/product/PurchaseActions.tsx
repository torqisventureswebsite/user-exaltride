"use client";

import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { useState, useTransition } from "react";
import { addToCart } from "@/lib/cart-actions";

interface PurchaseActionsProps {
  id: string;
  title?: string;
  price?: number;
  image?: string;
  categoryId?: string;
}

export default function PurchaseActions({
  id,
  title,
  price,
  image,
  categoryId,
}: PurchaseActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id || !title || !price) return;

    startTransition(async () => {
      const res = await addToCart(id, title, price, image || "", 1, categoryId);
      if (res.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Primary Buttons */}
      <div className="flex gap-2">
        <Button
          className={`flex-1 bg-yellow-500 text-gray-900 hover:bg-yellow-600`}
          onClick={handleAddToCart}
          disabled={isPending}
        >
          <ShoppingCart className="h-4 w-4" />
          {added ? "Added ✓" : "Add to Cart"}
        </Button>

        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
          Buy Now
        </Button>
      </div>

      {/* Secondary Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 gap-2">
          <Heart className="h-4 w-4" />
          Wishlist
        </Button>

        <Button variant="outline" className="flex-1 gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
