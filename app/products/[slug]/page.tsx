import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

import { fetchProductBySlug } from "@/lib/api/products";
import type { Product } from "@/components/product/ProductCard";

import ProductImages from "@/components/product/ProductImages";
import ProductInfo from "@/components/product/ProductInfo";
import ProductFeatures from "@/components/product/ProductFeatures";
import PurchaseActions from "@/components/product/PurchaseActions";
import ProductHighlights from "@/components/product/ProductHighlights";
import OffersSection from "@/components/product/OffersSection";
import FrequentlyBoughtSection from "@/components/product/FrequentlyBoughtSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import DeliveryAndServices from "@/components/product/DeliveryAndServices";
import KeyHighlights from "@/components/product/KeyHighlights";
import VehicleCompatibility from "@/components/product/VehicleCompatibility";
import { ChevronRight } from "lucide-react";
import InstallationGuide from "@/components/product/InstallationGuide";
import ProfessionalInstallationCard from "@/components/product/ProfessionalInstallationCard";
import SellerInfoCard from "@/components/product/SellerInfoCard";
import WhyBuyFromUs from "@/components/product/WhyBuyFromUs";
import BundlePriceBox from "@/components/product/BundlePriceBox";
import RecentlyViewedSection from "@/components/cart/RecentlyViewedSection";
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const discountAmount =
    product.compare_at_price && product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <main className="container mx-auto px-4 py-4 md:py-8">

        {/* ✅ BREADCRUMB */}
        <div className="mb-4 md:mb-6 flex items-center gap-2 text-xs md:text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">Home</a>
          <ChevronRight className="h-4 w-4" />
          <a href="/products" className="hover:text-blue-600">Products</a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{product.title}</span>
        </div>

        {/* ✅ TRUE 3 COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ✅ LEFT COLUMN → IMAGES */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ProductImages
              images={
                product.images?.length
                  ? product.images
                  : product.primary_image
                  ? [product.primary_image]
                  : ["/images/fallback.jpg"]
              }
              title={product.title}
              discount={discountAmount}
            />
                <PurchaseActions
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.primary_image}
              categoryId={product.category?.id} // ✅ FIXED for new API
            />
            <InstallationGuide/>
          </div>

          {/* ✅ CENTER COLUMN → PRODUCT INFO */}
          <div className="lg:col-span-4 space-y-6">
            <ProductInfo product={product} />
            <OffersSection />
            <DeliveryAndServices/>
            <KeyHighlights />
            <VehicleCompatibility />
        

            <ProductFeatures warranty={product.warranty_months} />

            
          </div>

          {/* ✅ RIGHT COLUMN → INSTALLATION / SELLER / TRUST */}
          <div className="lg:col-span-3 space-y-6">

 <div className="lg:col-span-3 space-y-6">
  <ProfessionalInstallationCard />
  <SellerInfoCard />
<WhyBuyFromUs />
<BundlePriceBox />
 
</div>

          </div>
        </div>

 

        {/* ✅ FREQUENTLY BOUGHT */}
        {/* <div className="mt-12">
          <FrequentlyBoughtSection baseProduct={product} />
        </div> */}

        {/* ✅ RELATED PRODUCTS */}
        {/* <div className="mt-12">
          <RelatedProducts
            categoryId={product.category?.id} // ✅ FIXED
            brandName={product.brand_name}
            currentProductId={product.id}
          />
        </div> */}

      </main>
      <RecentlyViewedSection/>  
      <RecentlyViewedSection title="Customers Who Bought Also Purchased" />
      <RecentlyViewedSection title="Customers Who Bought Also Viewed" />

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
