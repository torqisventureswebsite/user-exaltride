"use client";

import { Card } from "@/components/ui/card";
import { Product, ProductCard } from "@/components/product/ProductCard";
import MiniProductCard from "@/components/product/MiniProductCard";
import BundlePriceBox from "@/components/product/BundlePriceBox";
import productsData from "@/data/products.json";

export default function FrequentlyBoughtSection({
  baseProduct,
}: {
  baseProduct: Product;
}) {
  // 1. Get 3 related items
  const related = productsData
    .filter(
      (p) => p.category_id === baseProduct.category_id && p.id !== baseProduct.id
    )
    .slice(0, 3);

  // 2. Bundle price math
  const originalPrice =
    (baseProduct.compare_at_price || baseProduct.price || 0) +
    related.reduce(
      (sum, p) => sum + (p.compare_at_price || p.price || 0),
      0
    );

  const totalPrice =
    (baseProduct.price || 0) +
    related.reduce((sum, p) => sum + (p.price || 0), 0);

  const savings = originalPrice - totalPrice;

  return (
    <Card className="p-5 md:p-6 mt-10 rounded-xl shadow-sm space-y-6">
{/* --- Section Header --- */}
<div>
  <div className="flex items-center justify-between">
    <h2 className="text-lg md:text-xl font-bold text-gray-900">
      Frequently Bought Together
    </h2>

    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
      Save ₹{savings.toLocaleString()}
    </span>
  </div>

  <p className="text-sm text-gray-600">
    Complete your setup with these accessories
  </p>
</div>

      {/* --- Product Row (4 items) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* First card is the main product */}
        <ProductCard
          product={baseProduct}
          badges={{ primary: "This Item" }}
          showOffers={false}
        />

        {/* 3 related items */}
        {related.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            badges={
              i === 0
                ? { primary: "Popular", secondary: "48% OFF" }
                : i === 1
                ? { primary: "50% OFF" }
                : { primary: "Bestseller", secondary: "48% OFF" }
            }
            showOffers={false}
          />
        ))}
      </div>

      {/* --- BLUE BUNDLE BAR --- */}
      <BundlePriceBox
        totalPrice={totalPrice}
        originalPrice={originalPrice}
        savings={savings}
      />

      {/* --- Complete Your Setup --- */}
      <div>
        <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
          Complete Your Setup
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((product) => (
            <MiniProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </Card>
  );
}
