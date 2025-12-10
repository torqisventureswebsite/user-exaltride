import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { RecommendationsSection } from "@/components/home/RecommendationsSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import Footer from "@/components/layout/Footer";
import { TopDealsSection } from "@/components/home/TopDealsSection";
import { 
  fetchFeaturedProducts, 
  fetchTopDeals, 
  fetchBestRatedProducts,
  fetchNewArrivals,
  fetchAllProducts
} from "@/lib/api/products";

export default async function HomePage() {
  // Fetch different product sets from specialized API endpoints
  const [featuredProducts, topDeals, bestRated, newArrivals, allProducts] = await Promise.all([
    fetchFeaturedProducts(12),
    fetchTopDeals(12),
    fetchBestRatedProducts(12),
    fetchNewArrivals(12),
    fetchAllProducts(),
  ]);

  console.log("Featured products count:", featuredProducts.length);
  console.log("Top deals count:", topDeals.length);
  console.log("Best rated count:", bestRated.length);
  console.log("New arrivals count:", newArrivals.length);
  console.log("All products count:", allProducts.length);

  // Use allProducts as fallback if specialized endpoints return empty
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 12);
  const displayDeals = topDeals.length > 0 ? topDeals : allProducts.filter(p => p.discount_percentage && p.discount_percentage > 0).slice(0, 12);
  const displayBestRated = bestRated.length > 0 ? bestRated : allProducts.slice(0, 12);
  const displayNewArrivals = newArrivals.length > 0 ? newArrivals : allProducts.slice(0, 12);

  return (
    <div className="min-h-screen">
      <Header />
      <TopBar />
      <main>
        <HeroCarousel />
        <FeaturedProducts products={displayFeatured} />
        <CategoriesSection />
        <BrandsSection />
        <TopDealsSection products={displayDeals} />
        <RecommendationsSection products={displayBestRated} />
        <TrendingSection products={displayNewArrivals} />
      </main>
      <Footer />
    </div>
  );
}
