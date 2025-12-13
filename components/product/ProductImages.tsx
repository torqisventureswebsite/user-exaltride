"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useCar } from "@/lib/car/context";

interface CompatibleCar {
  id: string;
  make: string;
  model: string;
  year: number;
  variant?: string;
  notes?: string;
}

interface ProductImagesProps {
  images: string[];
  title?: string;
  discount?: number;
  compatibleCars?: CompatibleCar[];
  isUniversal?: boolean;
}

export default function ProductImages({
  images,
  title = "Product",
  discount = 0,
  compatibleCars = [],
  isUniversal = false,
}: ProductImagesProps) {
  const [selected, setSelected] = useState(0);
  const { selectedCar } = useCar();

  // Check if user's selected car matches any compatible car
  const checkCarCompatibility = (): boolean => {
    if (!selectedCar) return false;
    if (isUniversal) return true;
    
    return compatibleCars.some(car => 
      car.make.toLowerCase() === selectedCar.make.toLowerCase() &&
      car.model.toLowerCase() === selectedCar.model.toLowerCase() &&
      car.year === selectedCar.year
    );
  };

  const fitsUserCar = checkCarCompatibility();

  return (
    <div className="space-y-3">
      {/* ✅ FITS YOUR CAR TAG */}
      {fitsUserCar && selectedCar && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            This product fits your {selectedCar.make} {selectedCar.model} ({selectedCar.year})
          </span>
        </div>
      )}

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
