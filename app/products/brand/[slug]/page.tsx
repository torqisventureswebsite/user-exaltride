import { fetchBrands, fetchAllBrandProducts } from "@/lib/api/brands";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BrandPageClient from "@/components/brand/BrandPageClient";

export async function generateStaticParams() {
  const brands = await fetchBrands();
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const brands = await fetchBrands();
  const brand = brands.find((b) => b.slug === params.slug);

  if (!brand) {
    return {
      title: "Brand Not Found",
    };
  }

  return {
    title: `${brand.name} Products | ExaltRide`,
    description: brand.description || `Shop ${brand.name} automotive parts and accessories`,
  };
}

export const dynamic = "force-dynamic";

export default async function BrandPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  const brands = await fetchBrands();
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    notFound();
  }

  const products = await fetchAllBrandProducts(brand.slug);

  return (
    <>
      <Header />
      <BrandPageClient brand={brand} products={products} />
      <Footer />
    </>
  );
}
