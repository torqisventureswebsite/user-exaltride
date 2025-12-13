"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlist/context";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { ProductCard, Product } from "@/components/product/ProductCard";

export default function WishlistContent() {
  const { items, isLoading: loading } = useWishlist();

  // Convert wishlist items to Product format for ProductCard
  const mapWishlistItemToProduct = (item: typeof items[0]): Product => ({
    id: item.productId,
    title: item.title,
    slug: item.slug,
    price: item.price,
    primary_image: item.image,
    brand_name: item.brand_name,
    stock: item.in_stock ? 1 : 0,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="hidden md:block">
          <TopBar />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="aspect-square bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="hidden md:block">
          <TopBar />
        </div>
        <div className="container mx-auto px-4 py-16 flex-1">
          <div className="max-w-md mx-auto text-center">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Save your favorite items to your wishlist and shop them later!
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>
      <div className="container mx-auto px-4 py-8 flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-1">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <ProductCard
            key={item.productId}
            product={mapWishlistItemToProduct(item)}
          />
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline" className="px-8">
            Continue Shopping
          </Button>
        </Link>
      </div>
      </div>
      <Footer />
    </div>
  );
}
