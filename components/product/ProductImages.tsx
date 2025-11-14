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

export default function ProductImages({ images, title = "Product", discount = 0 }: ProductImagesProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-2 md:space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={images[selected] || "/images/image1.jpg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />

          {discount > 0 && (
            <Badge className="absolute left-4 top-4 bg-yellow-500 px-3 py-1 text-sm font-bold text-gray-900">
              {discount}% OFF
            </Badge>
          )}
        </div>
      </Card>

      {/* Thumbnail Row */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`relative h-16 w-16 flex-shrink-0 border rounded-md overflow-hidden ${
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
