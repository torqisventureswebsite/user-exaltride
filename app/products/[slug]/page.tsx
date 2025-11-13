import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import  TopBar  from "@/components/layout/TopBar";
import  Footer  from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  TruckIcon,
  Shield,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import productsData from "@/data/products.json";
import type { Product } from "@/components/product/ProductCard";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Find the product by slug
  const product = productsData.find((p) => p.slug === slug) as
    | Product
    | undefined;

  if (!product) {
    notFound();
  }

  // Get similar products (same category)
  const similarProducts = productsData
    .filter(
      (p) => p.category_id === product.category_id && p.id !== product.id
    )
    .slice(0, 4) as Product[];

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
        {/* Breadcrumb */}
        <div className="mb-4 md:mb-6 flex items-center gap-2 text-xs md:text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">
            Home
          </a>
          <ChevronRight className="h-4 w-4" />
          <a href="/products" className="hover:text-blue-600">
            Products
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{product.title}</span>
        </div>

        {/* Product Detail Section */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-2 md:space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src="/images/image1.jpg"
                  alt={product.title || "Product"}
                  fill
                  className="object-cover"
                  priority
                />
                {discountAmount > 0 && (
                  <Badge className="absolute left-4 top-4 bg-yellow-500 px-3 py-1 text-sm font-bold text-gray-900">
                    {discountAmount}% OFF
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-4 md:space-y-6">
            {/* Brand */}
            <div>
              <span className="text-sm text-gray-600">
                Brand: {product.brand_name}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1">
                  <span className="text-sm font-semibold text-white">
                    {product.rating.toFixed(1)}
                  </span>
                  <Star className="h-4 w-4 fill-white text-white" />
                </div>
                <span className="text-sm text-gray-600">
                  {(product.review_count || 0).toLocaleString()} ratings
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2 md:gap-3">
                <span className="text-2xl md:text-4xl font-bold text-gray-900">
                  ₹{(product.price || 0).toLocaleString()}
                </span>
                {product.compare_at_price && (
                  <span className="text-lg md:text-xl text-gray-500 line-through">
                    ₹{product.compare_at_price.toLocaleString()}
                  </span>
                )}
              </div>
              {discountAmount > 0 && (
                <p className="text-sm text-green-600">
                  You save ₹
                  {(
                    (product.compare_at_price || 0) - (product.price || 0)
                  ).toLocaleString()}{" "}
                  ({discountAmount}% off)
                </p>
              )}
            </div>

            {/* Stock Status */}
            {product.stock && product.stock > 0 ? (
              <Badge className="bg-green-100 text-green-800">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
            )}

            {/* Description */}
            <div>
              <h3 className="mb-2 text-sm md:text-base font-semibold text-gray-900">Description</h3>
              <p className="text-sm md:text-base text-gray-600">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 md:gap-3">
              <Button
                size="default"
                className="flex-1 gap-1 md:gap-2 bg-yellow-500 text-gray-900 hover:bg-yellow-600 h-10 md:h-11 text-xs md:text-sm"
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                Add to Cart
              </Button>
              <Button
                size="default"
                className="flex-1 gap-1 md:gap-2 bg-blue-600 hover:bg-blue-700 h-10 md:h-11 text-xs md:text-sm"
              >
                Buy Now
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-2 md:gap-3">
              <Button variant="outline" size="default" className="flex-1 gap-1 md:gap-2 h-10 md:h-11 text-xs md:text-sm">
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Wishlist</span>
              </Button>
              <Button variant="outline" size="default" className="flex-1 gap-1 md:gap-2 h-10 md:h-11 text-xs md:text-sm">
                <Share2 className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>

            {/* Features */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <TruckIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-gray-600">On orders above ₹999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">
                      {product.warranty_months || 6} Months Warranty
                    </p>
                    <p className="text-gray-600">Authorized warranty</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">7 Days Return</p>
                    <p className="text-gray-600">Easy return & exchange</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Product Details */}
            <Card className="p-4">
              <h3 className="mb-3 font-semibold text-gray-900">
                Product Details
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">SKU</dt>
                  <dd className="font-medium">{product.sku}</dd>
                </div>
                {product.weight_kg && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Weight</dt>
                    <dd className="font-medium">{product.weight_kg} kg</dd>
                  </div>
                )}
                {product.dimensions_cm && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Dimensions</dt>
                    <dd className="font-medium">{product.dimensions_cm} cm</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Type</dt>
                  <dd className="font-medium">
                    {product.is_oem ? "OEM" : "Aftermarket"}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className="mt-8 md:mt-16">
            <div className="mb-4 md:mb-8">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                Similar Products
              </h2>
              <p className="text-xs md:text-base text-gray-600">
                Products from the same category
              </p>
            </div>

            {/* Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="overflow-x-auto pb-4 md:overflow-visible -mx-4 px-4">
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {similarProducts.map((similarProduct, index) => (
                  <div key={similarProduct.id} className="flex-shrink-0 w-[165px] md:w-auto">
                    <ProductCard
                      product={similarProduct}
                      badges={
                        index === 0
                          ? { primary: "Bestseller", secondary: "Hot Deal" }
                          : undefined
                      }
                      showOffers
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer - Hidden on Mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
