"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ProductImagesProps {
  images: string[];
  title?: string;
  discount?: number;
}

export default function ProductImages({
  images,
  title = "Product",
  discount = 0,
}: ProductImagesProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      {/* ✅ MAIN IMAGE (SMALLER NOW) */}
      <Card className="overflow-hidden w-full mx-auto">
        <div className="relative aspect-[4/3]">   {/* 👈 Reduced from square */}
          <Image
            src={images[selected] || "/images/image1.jpg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />

          {discount > 0 && (
            <Badge className="absolute left-3 top-3 bg-yellow-500 px-3 py-1 text-xs font-bold text-gray-900">
              {discount}% OFF
            </Badge>
          )}
        </div>
      </Card>

      {/* ✅ THUMBNAILS BELOW */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`relative h-14 w-14 flex-shrink-0 border rounded-md overflow-hidden ${
              selected === i ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <Image
              src={img}
              alt={`${title}-${i}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
