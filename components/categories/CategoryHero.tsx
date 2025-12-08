"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, HelpCircle } from "lucide-react";

export default function CategoryHero({
  name,
  productCount,
  description,
}: {
  name: string;
  productCount: number;
  description?: string;
}) {
  return (
<section
  className="
    w-full 
    bg-[#001F5F]
    text-white 
    px-4 py-5
    md:py-8 md:px-6
  "
>

      <div
        className="
          max-w-[480px] mx-auto
          md:max-w-none 
          flex flex-col md:flex-row 
          md:items-center 
          md:justify-between 
          gap-4
        "
      >
        {/* LEFT */}
        <div>
          {/* Title */}
          <h1
            className="
              text-xl font-bold 
              md:text-3xl
            "
          >
            {name}
          </h1>

          {/* Product Count */}
          <p
            className="
              text-sm opacity-90 mt-1 
              md:text-base
            "
          >
            Showing {productCount.toLocaleString()} products
          </p>

          {/* Description — desktop only */}
          {description && (
            <p className="hidden md:block text-sm opacity-80 mt-1">
              {description}
            </p>
          )}

          {/* BADGES */}
          <div
            className="
              flex flex-wrap gap-2 mt-3 
            "
          >
            <Badge className="bg-white text-blue-700 px-3 py-1 text-xs">
              ⚡ Fast Delivery
            </Badge>
            <Badge className="bg-white text-blue-700 px-3 py-1 text-xs">
              Up to 60% OFF
            </Badge>
            <Badge className="bg-white text-blue-700 px-3 py-1 text-xs">
              Warranty Included
            </Badge>
            <Badge className="bg-white text-blue-700 px-3 py-1 text-xs">
              COD Available
            </Badge>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div
          className="
            flex items-center gap-3 
            mt-1
          "
        >
          {/* Icon-only on mobile */}
          <Button
            variant="outline"
            className="
              bg-white text-blue-700 
              p-2 h-9 w-9 flex items-center justify-center
              md:w-auto md:px-4
            "
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden md:inline ml-2">Share</span>
          </Button>

          <Button
            variant="outline"
            className="
              bg-white text-blue-700 
              p-2 h-9 w-9 flex items-center justify-center
              md:w-auto md:px-4
            "
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden md:inline ml-2">Guide</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
