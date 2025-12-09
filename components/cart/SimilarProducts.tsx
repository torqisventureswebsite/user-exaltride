import Image from "next/image";
import Link from "next/link";
import { getSimilarProducts } from "@/lib/product-helpers";
import type { Product } from "@/lib/product-helpers";

interface SimilarProductsProps {
  categoryIds: string[];
  excludeProductIds: string[];
}

export default async function SimilarProducts({
  categoryIds,
  excludeProductIds,
}: SimilarProductsProps) {
  if (categoryIds.length === 0) {
    return null;
  }

  const similarProducts = await getSimilarProducts(categoryIds, 8, excludeProductIds);

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Items You May Like</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={product.primary_image || "/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.discount_percentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {Math.round(product.discount_percentage)}% OFF
            </div>
          )}
        </div>
        
        <div className="p-3 md:p-4">
          <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 mb-2">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toFixed(2)}
            </span>
            {product.compare_at_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{product.brand_name}</span>
            {product.stock > 0 ? (
              <span className="text-xs text-yellow-600 font-medium">In Stock</span>
            ) : (
              <span className="text-xs text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
