import { fetchAllProducts } from "@/lib/api/products";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  categoryId?: string;
  brandName?: string;
  currentProductId: string;
}

export default async function RelatedProducts({
  categoryId,
  brandName,
  currentProductId,
}: RelatedProductsProps) {
  const allProducts = await fetchAllProducts();

  // Filter related products by category or brand
  let relatedProducts = allProducts.filter((p) => {
    if (p.id === currentProductId) return false;
    
    if (categoryId && p.category_id === categoryId) return true;
    if (brandName && p.brand_name === brandName) return true;
    
    return false;
  });

  // Limit to 8 products
  relatedProducts = relatedProducts.slice(0, 8);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Related Products
      </h2>
      {/* Horizontal scrollable container */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-4 pb-4" style={{ minWidth: "max-content" }}>
          {relatedProducts.map((product) => (
            <div key={product.id} className="w-[180px] sm:w-[200px] md:w-[220px] flex-shrink-0">
              <ProductCard product={product} showOffers />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
