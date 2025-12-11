import { fetchBestSellingProducts } from "@/lib/api/products";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { TrendingUp } from "lucide-react";
import CollectionPageClient from "@/components/products/CollectionPageClient";

export const metadata = {
  title: "Best Selling Products | ExaltRide",
  description: "Most popular car accessories loved by customers",
};

export default async function BestSellingPage() {
  const products = await fetchBestSellingProducts(200);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <CollectionPageClient
        products={products}
        title="Best Selling Products"
        description="Most popular products loved by customers"
        icon={<TrendingUp className="h-8 w-8 text-white" />}
        iconBgColor="bg-green-500"
      />

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
