"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string | null;
    slug: string;
    item_count?: number;
  };
  productImages: string[];
  bgColor?: string;
}

export function CategoryCard({
  category,
  productImages,
  bgColor = "black",
}: CategoryCardProps) {
  // Display up to 5 product images in a grid
  const displayImages = productImages.slice(0, 5);

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card
        className={`group relative overflow-hidden bg-[#FFC107] border-none p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {category.name}
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              {category.description || "Explore our collection"}
            </p>
            {category.item_count && (
              <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900">
                {category.item_count} items
              </span>
            )}
          </div>
          <ArrowRight className="h-5 w-5 text-gray-900 transition-transform group-hover:translate-x-1" />
        </div>

        {/* Product Images Grid */}
        <div className="grid grid-cols-3 gap-2">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg ${
                index === 0
                  ? "col-span-2 row-span-2 h-48"
                  : index === 1
                    ? "col-span-1 row-span-2 h-48"
                    : "h-20"
              }`}
            >
              <Image
                src={image}
                alt={`${category.name} product ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-110"
                sizes={index === 0 || index === 1 ? "200px" : "100px"}
              />
            </div>
          ))}
        </div>
      </Card>
    </Link>
  );
}
