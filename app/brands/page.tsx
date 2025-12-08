import { fetchBrands } from "@/lib/api/brands";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Shop by Brands | ExaltRide",
  description: "Explore premium automotive parts and accessories from top brands",
};

export default async function BrandsPage() {
  const brands = await fetchBrands();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop by Brands</h1>
          <p className="text-xl text-blue-100">
            Discover premium products from the world's leading automotive brands
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            All Brands ({brands.length})
          </h2>
          <p className="text-gray-600">
            Browse our collection of trusted automotive brands
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group"
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-square relative mb-4 bg-white rounded-lg flex items-center justify-center">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-gray-400">
                      {brand.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-center text-gray-900 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h3>
                {brand.product_count && brand.product_count > 0 && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {brand.product_count} products
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No brands available</p>
          </div>
        )}
      </div>

      {/* Featured Brands Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Premium Brands?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Authentic Products</h3>
              <p className="text-gray-600">
                100% genuine products directly from authorized dealers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Warranty Support</h3>
              <p className="text-gray-600">
                Full manufacturer warranty on all branded products
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Superior performance and durability you can trust
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
