import { RecommendationCard } from "@/components/product/RecommendationCard";
import productsData from "@/data/products.json";
import type { Product } from "@/components/product/ProductCard";

const recommendedProducts = productsData as Product[];

export function RecommendationsSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-3xl font-bold">Recommended for You</h2>
      <div className="flex gap-4 overflow-x-auto">
        {recommendedProducts.map((product) => (
          <RecommendationCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
