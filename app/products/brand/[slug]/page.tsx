import { fetchBrands, fetchAllBrandProducts } from "@/lib/api/brands";
import { ProductCard } from "@/components/product/ProductCard";
import { notFound } from "next/navigation";
import Image from "next/image";

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

  console.log("BRAND PAGE PARAM:", slug);

  const brands = await fetchBrands();
  console.log("ALL BRAND SLUGS:", brands.map((b) => b.slug));

  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    console.log("❌ BRAND NOT FOUND FOR:", slug);
    notFound();
  }

const products = await fetchAllBrandProducts(brand.id);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {brand.logo && (
              <div className="bg-white rounded-lg p-6 w-32 h-32 flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{brand.name}</h1>
              {brand.description && (
                <p className="text-xl text-gray-300 mb-4">{brand.description}</p>
              )}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold">{products.length}</span>
                  <span className="text-sm ml-2">Products</span>
                </div>
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
{/* ✅ ALL PRODUCTS SECTION */}
<div className="container mx-auto px-4 py-10">

  {/* HEADER ROW */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        All {brand.name} Products
      </h2>
      <p className="text-sm text-gray-600">
        Showing {products.length}{" "}
        {products.length === 1 ? "product" : "products"}
      </p>
    </div>

    {/* SORT (UI ONLY FOR NOW) */}
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Sort by:</label>
      <select className="border rounded-lg px-3 py-2 text-sm">
        <option>Relevance</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Latest</option>
        <option>Top Rated</option>
      </select>
    </div>
  </div>

  {/* ✅ PRODUCT GRID */}
  {products.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showOffers
        />
      ))}
    </div>
  ) : (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">
        No products available for this brand
      </p>
    </div>
  )}
</div>


      {/* Why Choose This Brand */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose {brand.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                Premium quality products with rigorous testing standards
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Value</h3>
              <p className="text-gray-600">
                Competitive pricing with excellent performance
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Dedicated customer service and technical assistance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
