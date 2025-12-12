import { fetchBestSellingProducts } from "@/lib/api/products";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { Star } from "lucide-react";
import CollectionPageClient from "@/components/products/CollectionPageClient";

export const metadata = {
  title: "Featured Products | ExaltRide",
  description: "Handpicked car accessories for you",
};

export default async function FeaturedProductsPage() {
  const products = await fetchBestSellingProducts(200);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <CollectionPageClient
        products={products}
        title="Featured Products"
        description="Handpicked products for you"
        icon={<Star className="h-8 w-8 text-yellow-400" />}
        iconBgColor="bg-[#001F5F]"
      />

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
