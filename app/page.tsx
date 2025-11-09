import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
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
      {/* 1. Navbar */}
      <Header />

      {/* 2. Mini Menubar */}
      <TopBar />
      
      <main>
        {/* 3. Carousel */}
        <HeroCarousel />
        
        {/* 4. Featured Products */}
        <FeaturedProducts />
        
        {/* 5. Shop by Categories */}
        <CategoriesSection />
        
        {/* 6. Top Brands */}
        <BrandsSection />
        
        {/* 7. Recommendations */}
        <RecommendationsSection />
        
        {/* 8. Trending */}
        <TrendingSection />
      </main>
      
      {/* 9. Footer */}
      <Footer />
    </div>
  );
}
