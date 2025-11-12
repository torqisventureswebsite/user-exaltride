import { ProductCard } from "@/components/product/ProductCard";
import productsData from "@/data/products.json";
import type { Product } from "@/components/product/ProductCard";

const trendingProducts = productsData.slice(0, 4) as Product[];

export function TrendingSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-2xl md:text-3xl font-bold">Trending Now</h2>
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 min-w-min">
          {trendingProducts.map((product, index) => (
            <div key={product.id} className="w-[165px] md:w-auto">
              <ProductCard
                product={product}
                badges={
                  index === 0
                    ? { primary: "Trending", secondary: "Popular" }
                    : undefined
                }
                showOffers
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
