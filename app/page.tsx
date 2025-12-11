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
import { fetchHomepageData, fetchNewArrivals } from "@/lib/api/products";

export default async function HomePage() {
  // Fetch homepage data from unified /homepage API for displaying cards
  // View All links will use their respective individual APIs
  const [homepageData, newArrivals] = await Promise.all([
    fetchHomepageData(),
    fetchNewArrivals(12), // For trending section
  ]);

  const { best_selling, shop_by_categories, top_brands, top_deals, best_rated } = homepageData;

  console.log("Homepage API - Best selling:", best_selling.length);
  console.log("Homepage API - Categories:", shop_by_categories.length);
  console.log("Homepage API - Top brands:", top_brands.length);
  console.log("Homepage API - Top deals:", top_deals.length);
  console.log("Homepage API - Best rated:", best_rated.length);
  console.log("New arrivals API:", newArrivals.length);

  // Use homepage data for sections, fallback to newArrivals if empty
  const displayFeatured = best_selling.length > 0 ? best_selling : newArrivals;
  const displayDeals = top_deals.length > 0 ? top_deals : newArrivals;
  const displayBestRated = best_rated.length > 0 ? best_rated : newArrivals;
  const displayTrending = newArrivals;

  return (
    <div className="min-h-screen">
      <Header />
      <TopBar />
      <main>
        <HeroCarousel />
        <FeaturedProducts products={displayFeatured} />
        <CategoriesSection categories={shop_by_categories} />
        <BrandsSection brands={top_brands} />
        <TopDealsSection products={displayDeals} />
        <RecommendationsSection products={displayBestRated} />
        <TrendingSection products={displayTrending} />
      </main>
      <Footer />
    </div>
  );
}
