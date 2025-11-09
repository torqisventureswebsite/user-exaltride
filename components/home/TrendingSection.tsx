import { ProductCard } from "@/components/product/ProductCard";

export function TrendingSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-3xl font-bold">Trending Now</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard product={{}} />
        <ProductCard product={{}} />
        <ProductCard product={{}} />
        <ProductCard product={{}} />
      </div>
    </section>
  );
}
