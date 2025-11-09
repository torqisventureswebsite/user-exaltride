import { RecommendationCard } from "@/components/product/RecommendationCard";

export function RecommendationsSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-3xl font-bold">Recommended for You</h2>
      <div className="flex gap-4 overflow-x-auto">
        <RecommendationCard />
        <RecommendationCard />
        <RecommendationCard />
        <RecommendationCard />
        <RecommendationCard />
      </div>
    </section>
  );
}
