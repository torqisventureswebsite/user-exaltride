import { fetchTopDeals } from "@/lib/api/products";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { Tag } from "lucide-react";
import CollectionPageClient from "@/components/products/CollectionPageClient";

export const metadata = {
  title: "Top Deals | ExaltRide",
  description: "Exclusive discounts on car accessories",
};

export default async function DealsPage() {
  const products = await fetchTopDeals(200);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <CollectionPageClient
        products={products}
        title="Top Deals"
        description="Exclusive discounts for you"
        icon={<Tag className="h-8 w-8 text-yellow-400" />}
        iconBgColor="bg-[#001F5F]"
      />

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
