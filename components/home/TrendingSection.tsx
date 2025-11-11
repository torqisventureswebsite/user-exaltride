import { ProductCard } from "@/components/product/ProductCard";
import productsData from "@/data/products.json";
import type { Product } from "@/components/product/ProductCard";

const trendingProducts = productsData.slice(0, 4) as Product[];

export function TrendingSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-3xl font-bold">Trending Now</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trendingProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            badges={
              index === 0
                ? { primary: "Trending", secondary: "Popular" }
                : undefined
            }
            showOffers
          />
        ))}
      </div>
    </section>
  );
}
