import { fetchNewArrivals } from "@/lib/api/products";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { Flame } from "lucide-react";
import CollectionPageClient from "@/components/products/CollectionPageClient";

export const metadata = {
  title: "Trending This Week | ExaltRide",
  description: "Hot picks that car enthusiasts are loving right now",
};

export default async function TrendingPage() {
  const products = await fetchNewArrivals(200);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <CollectionPageClient
        products={products}
        title="Trending This Week"
        description="Hot picks that car enthusiasts are loving right now"
        icon={<Flame className="h-8 w-8 text-white" />}
        iconBgColor="bg-orange-500"
      />

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
