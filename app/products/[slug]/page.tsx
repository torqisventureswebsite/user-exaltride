import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

import productsData from "@/data/products.json";
import type { Product } from "@/components/product/ProductCard";

import ProductImages from "@/components/product/ProductImages";
import ProductInfo from "@/components/product/ProductInfo";
import PriceBox from "@/components/product/PriceBox";
import ProductFeatures from "@/components/product/ProductFeatures";
import PurchaseActions from "@/components/product/PurchaseActions";
import ProductHighlights from "@/components/product/ProductHighlights";
import OffersSection from "@/components/product/OffersSection";
import FrequentlyBoughtSection from "@/components/product/FrequentlyBoughtSection";

import { ChevronRight } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Find product
  const product = productsData.find((p) => p.slug === slug) as Product | undefined;
  if (!product) notFound();

  // Discount %
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
      {/* HEADER */}
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <main className="container mx-auto px-4 py-4 md:py-8">

        {/* BREADCRUMB */}
        <div className="mb-4 md:mb-6 flex items-center gap-2 text-xs md:text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">Home</a>
          <ChevronRight className="h-4 w-4" />

          <a href="/products" className="hover:text-blue-600">Products</a>
          <ChevronRight className="h-4 w-4" />

          <span className="text-gray-900">{product.title}</span>
        </div>

        {/* MAIN PRODUCT GRID */}
        <div className="grid gap-6 md:gap-10 lg:grid-cols-2">

          {/* LEFT → IMAGES */}
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

          {/* RIGHT → MAIN INFO */}
          <section className="space-y-6">
            <ProductInfo product={product} />

            {/* <PriceBox
              price={product.price}
              compareAt={product.compare_at_price}
            /> */}

            <PurchaseActions
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.primary_image}
            categoryId={product.category_id}
          />

            <ProductFeatures warranty={product.warranty_months} />
          </section>
        </div>

        {/* PRODUCT HIGHLIGHTS */}
        <div className="mt-10">
        <ProductHighlights
        sku={product.sku}
        weight={product.weight_kg}
        dimensions={product.dimensions_cm}
        is_oem={product.is_oem}
      />

        </div>

        {/* OFFERS SECTION */}
        <div className="mt-10">
          <OffersSection />
        </div>

        {/* FREQUENTLY BOUGHT */}
        <div className="mt-10">
          <FrequentlyBoughtSection baseProduct={product} />
        </div>
      </main>

      {/* FOOTER */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
