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
    <section className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-4 rounded-xl mb-6">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          <p className="text-sm md:text-base opacity-90 mt-1">
            Showing {productCount.toLocaleString()} products
          </p>
          {description && (
            <p className="text-sm opacity-80 mt-1 hidden md:block">{description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge className="bg-white text-blue-700 px-3 py-1">⚡ Fast Delivery</Badge>
            <Badge className="bg-white text-blue-700 px-3 py-1">Up to 60% OFF</Badge>
            <Badge className="bg-white text-blue-700 px-3 py-1">Warranty Included</Badge>
            <Badge className="bg-white text-blue-700 px-3 py-1">COD Available</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white text-blue-700">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="bg-white text-blue-700">
            <HelpCircle className="h-4 w-4 mr-2" />
            Guide
          </Button>
        </div>
      </div>
    </section>
  );
}
