import { TopBar } from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { RecommendationsSection } from "@/components/home/RecommendationsSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <TopBar />
      <main>
        <HeroCarousel />
        <FeaturedProducts />
        <CategoriesSection />
        <BrandsSection />
        <RecommendationsSection />
        <TrendingSection />
      </main>
      <Footer />
    </div>
  );
}
