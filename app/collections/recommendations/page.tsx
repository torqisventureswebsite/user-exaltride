import { fetchBestSellingProducts } from "@/lib/api/products";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { Award } from "lucide-react";
import CollectionPageClient from "@/components/products/CollectionPageClient";

export const metadata = {
  title: "Expert Recommendations | ExaltRide",
  description: "Curated by industry professionals - best selling car accessories",
};

export default async function RecommendationsPage() {
  const products = await fetchBestSellingProducts(200);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <CollectionPageClient
        products={products}
        title="Expert Recommendations"
        description="Curated by industry professionals"
        icon={<Award className="h-8 w-8 text-blue-900" />}
        iconBgColor="bg-yellow-400"
      />

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
