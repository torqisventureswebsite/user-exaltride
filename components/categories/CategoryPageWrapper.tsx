"use client";

import CategoryPageClient from "./CategoryPageClient";
import type { Product } from "@/components/product/ProductCard";

export default function CategoryPageWrapper({
  category,
  initialProducts,
  subCategories,
}: {
  category: { id: string; name: string; slug: string; description?: string };
  initialProducts: Product[];
  subCategories: { id: string; name: string; slug: string }[];
}) {
  return (
    <CategoryPageClient
      category={category}
      initialProducts={initialProducts}
      subCategories={subCategories}
    />
  );
}
