// components/product/ProductInfo.tsx
import PriceBox from "./PriceBox";
import { Star } from "lucide-react";
import type { Product } from "@/components/product/ProductCard";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-4 md:space-y-6">

      {/* Brand */}
      <span className="text-sm text-gray-600">
        Brand: {product.brand_name}
      </span>

      {/* Title */}
      <h1 className="text-xl md:text-3xl font-bold text-[#001F5F]">
        {product.title}
      </h1>

      {/* Rating - only show if rating > 0 and has reviews */}
      {product.rating !== undefined && product.rating > 0 && (product.review_count || 0) > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded bg-[#001F5F] px-3 py-1">
            <span className="text-sm font-semibold text-white">
              {product.rating.toFixed(1)}
            </span>
            <Star className="h-4 w-4 fill-white text-white" />
          </div>

          <span className="text-sm text-gray-600">
            {(product.review_count || 0).toLocaleString()} ratings
          </span>
        </div>
      )}

      {/* ✅ Price Box */}
      <PriceBox
        price={product.price}
        compareAt={product.compare_at_price}
      />

      {/* Description */}
      {product.description && (
        <div>
          <h3 className="mb-2 text-sm md:text-base font-semibold text-gray-900">
            Description
          </h3>
          <p className="text-sm md:text-base text-gray-600">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
