"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Play,
  Star,
  Users,
  Shield,
  Truck,
  CheckCircle,
  Percent,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  Headphones,
  Package,
  ArrowRight,
  Home,
  Tag,
} from "lucide-react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
}

interface BrandPageClientProps {
  brand: Brand;
  products: Product[];
}

export default function BrandPageClient({ brand, products }: BrandPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category_id) cats.add(p.category_id);
    });
    return Array.from(cats);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
        );
        break;
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sortBy]);

  // Badge assignments for products
  const getBadges = (index: number) => {
    const badgeTypes = [
      { primary: "Bestseller" },
      { primary: "Top Rated" },
      { primary: "Featured" },
      { primary: "Hot Deal" },
      { primary: "New Launch" },
      { primary: "Premium" },
    ];
    return badgeTypes[index % badgeTypes.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Top Bar */}
      <div className="bg-[#001F5F] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <Link href="/" className="text-white/80 hover:text-white text-sm flex items-center gap-1">
              <Home className="h-3 w-3" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-white/50" />
            <Link href="/products" className="text-white/80 hover:text-white text-sm">
              Brands
            </Link>
            <ChevronRight className="h-3 w-3 text-white/50" />
            <span className="text-yellow-400 text-sm font-medium">{brand.name} Official Store</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#001F5F] via-[#002d7a] to-[#001F5F] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        </div>
        
        {/* Large Brand Name Watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[200px] font-bold text-white/5 tracking-wider pointer-events-none hidden lg:block">
          {brand.name.toUpperCase()}
        </div>

        <div className="container mx-auto px-4 py-10 md:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              {/* Brand Logo & Badge */}
              <div className="flex items-center gap-4 mb-6">
                {brand.logo ? (
                  <div className="bg-white rounded-xl p-4 w-24 h-24 flex items-center justify-center shadow-lg">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-4 w-24 h-24 flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-[#001F5F]">{brand.name.charAt(0)}</span>
                  </div>
                )}
                <Badge className="bg-yellow-500 text-white px-3 py-1.5 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Official Brand Store
                </Badge>
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Transform Your Drive with
                <br />
                <span className="text-yellow-400">{brand.name} Innovation</span>
              </h1>

              <p className="text-white/80 text-base md:text-lg mb-6 max-w-lg">
                {brand.description || `Experience premium car audio, cutting-edge dash cameras, and intelligent accessories. Elevate every journey with ${brand.name}'s legendary sound quality and innovation.`}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">3-Year Warranty</p>
                    <p className="text-white/60 text-xs">Extended Coverage</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">100% Authentic</p>
                    <p className="text-white/60 text-xs">Genuine Products</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-white/60 text-xs">Pan India Delivery</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <Headphones className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Expert Support</p>
                    <p className="text-white/60 text-xs">24/7 Assistance</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#001F5F] border-2 border-white hover:bg-white hover:text-[#001F5F] text-white font-semibold px-6 py-3 h-auto">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Explore Products
                </Button>
                <Button variant="outline" className="border-2 border-white/30 bg-transparent hover:bg-white/10 text-white font-semibold px-6 py-3 h-auto">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Video
                </Button>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Product Image */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                  <Image
                    src="/images/image1.jpg"
                    alt={`${brand.name} Product`}
                    width={500}
                    height={350}
                    className="rounded-xl object-cover w-full"
                  />
                </div>

                {/* Rating Badge */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">4.8</p>
                      <p className="text-xs text-gray-500">Average Rating</p>
                    </div>
                  </div>
                </div>

                {/* Customers Badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl px-6 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xl font-bold text-gray-900">2M+</p>
                      <p className="text-xs text-gray-500">Happy Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Bar */}
      <div className="bg-yellow-400">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 overflow-x-auto scrollbar-hide gap-6">
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex items-center gap-2 text-[#001F5F] text-sm font-medium whitespace-nowrap">
                <Package className="h-4 w-4" />
                Free Installation on Audio Systems
              </div>
              <div className="flex items-center gap-2 text-[#001F5F] text-sm font-medium whitespace-nowrap">
                <Percent className="h-4 w-4" />
                Up to 30% OFF on Select Products
              </div>
              <div className="flex items-center gap-2 text-[#001F5F] text-sm font-medium whitespace-nowrap">
                <Clock className="h-4 w-4" />
                Limited Time Offer - Ends Soon!
              </div>
            </div>
            <Button size="sm" className="bg-[#001F5F] hover:bg-[#001844] text-white font-semibold flex-shrink-0">
              View Offers
            </Button>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div>
              <Badge className="bg-blue-100 text-blue-700 mb-4">
                <Award className="h-3 w-3 mr-1" />
                75+ Years of Innovation
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Why Choose {brand.name}?
              </h2>
              <p className="text-gray-600 mb-6">
                For over seven decades, {brand.name} has been at the forefront of audio innovation. Our car accessories combine cutting-edge technology with legendary sound quality, ensuring every drive is an immersive experience.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Industry-Leading Technology</p>
                    <p className="text-gray-500 text-xs">Innovation in every product</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Premium Build Quality</p>
                    <p className="text-gray-500 text-xs">Made to last</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Easy Installation</p>
                    <p className="text-gray-500 text-xs">Professional support included</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Global Warranty</p>
                    <p className="text-gray-500 text-xs">Worldwide coverage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6">
                <Image
                  src="/images/image2.jpg"
                  alt={`${brand.name} Products`}
                  width={500}
                  height={350}
                  className="rounded-xl object-cover w-full"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#001F5F] text-white rounded-xl px-4 py-3 shadow-lg">
                <p className="text-2xl font-bold">#1</p>
                <p className="text-xs text-white/80">Audio Brand</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white">
            <Badge className="bg-red-500 text-white text-xs mb-3">New Arrival</Badge>
            <h3 className="text-xl font-bold mb-1">XAV Series</h3>
            <p className="text-lg font-semibold mb-3">Audio Systems</p>
            <Link href="#products" className="flex items-center gap-1 text-sm font-medium hover:underline">
              Explore Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-5 text-white">
            <Badge className="bg-yellow-400 text-gray-900 text-xs mb-3">Bestsellers</Badge>
            <h3 className="text-xl font-bold mb-1">Premium</h3>
            <p className="text-lg font-semibold mb-3">Dash Cameras</p>
            <Link href="#products" className="flex items-center gap-1 text-sm font-medium hover:underline">
              Shop Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-5 text-white">
            <Badge className="bg-yellow-500 text-white text-xs mb-3">Hot Deals</Badge>
            <h3 className="text-xl font-bold mb-1">Speaker</h3>
            <p className="text-lg font-semibold mb-3">Systems</p>
            <Link href="#products" className="flex items-center gap-1 text-sm font-medium hover:underline">
              View Deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-[#001F5F] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Package className="h-4 w-4" />
            All Products
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
            🎵 Car Audio Systems
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
            📹 Dash Cameras
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
            📺 Car Displays
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
            🔊 Premium Speakers
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
            ⚡ Accessories
          </button>
        </div>
      </div>

      {/* Exclusive Offer Banner */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden md:block">
            <Image
              src="/images/image1.jpg"
              alt="Offer"
              fill
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <Badge className="bg-yellow-400 text-gray-900 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              EXCLUSIVE {brand.name.toUpperCase()} OFFER
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Get Free Installation Worth ₹2,999
            </h3>
            <p className="text-white/80 mb-4">
              On all {brand.name} Car Audio Systems. Offer valid till December 31, 2025.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-white text-sm">
                <CheckCircle className="h-4 w-4 text-yellow-400" />
                Professional installation by certified technicians
              </li>
              <li className="flex items-center gap-2 text-white text-sm">
                <CheckCircle className="h-4 w-4 text-yellow-400" />
                1-year warranty on installation work
              </li>
              <li className="flex items-center gap-2 text-white text-sm">
                <CheckCircle className="h-4 w-4 text-yellow-400" />
                Free home service available in 50+ cities
              </li>
            </ul>
            <Button className="bg-[#001F5F] hover:bg-[#001844] text-white font-semibold">
              Claim Offer Now
            </Button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="container mx-auto px-4 py-8">
        <div className="flex md:items-center gap-5 flex-col md:flex-row md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    badges={getBadges(index)}
                    showOffers
                  />
                ))}
            </div>

            {/* Pagination */}
            {filteredProducts.length > itemsPerPage && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  variant="outline"
                  disabled={page === 1}
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: Math.ceil(filteredProducts.length / itemsPerPage) },
                    (_, i) => i + 1
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-[#001F5F] text-white"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(Math.ceil(filteredProducts.length / itemsPerPage), p + 1)
                    )
                  }
                  variant="outline"
                  disabled={page === Math.ceil(filteredProducts.length / itemsPerPage)}
                  size="sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products available for this brand</p>
          </div>
        )}
      </div>
    </div>
  );
}
