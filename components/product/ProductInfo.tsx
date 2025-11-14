import PriceBox from "./PriceBox";
import { Badge } from "@/components/ui/badge";
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
      <h1 className="text-xl md:text-3xl font-bold text-gray-900">
        {product.title}
      </h1>

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1">
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

      {/* Price Box */}
      <PriceBox
        price={product.price}
        compareAt={product.compare_at_price}
      />

      {/* Stock */}
      {product.stock && product.stock > 0 ? (
        <Badge className="bg-green-100 text-green-800">
          In Stock ({product.stock} available)
        </Badge>
      ) : (
        <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
      )}

      {/* Description */}
      <div>
        <h3 className="mb-2 text-sm md:text-base font-semibold text-gray-900">Description</h3>
        <p className="text-sm md:text-base text-gray-600">
          {product.description}
        </p>
      </div>
    </div>
  );
}
