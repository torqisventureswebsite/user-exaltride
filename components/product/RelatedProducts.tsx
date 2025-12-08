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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} showOffers />
        ))}
      </div>
    </div>
  );
}
