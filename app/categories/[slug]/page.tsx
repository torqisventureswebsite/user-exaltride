// app/categories/[slug]/page.tsx
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import CategoryPageClient from "@/components/categories/CategoryPageClient";
import { fetchAllProducts } from "@/lib/api/products";
import { fetchCategoryBySlug, fetchSubcategories } from "@/lib/api/categories";

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  // Fetch category from API
  const category = await fetchCategoryBySlug(slug);
  if (!category) notFound();

  // Fetch subcategories
  const subCats = await fetchSubcategories(category.id);

  // Parent + children IDs
  const validIds = [category.id, ...subCats.map((s) => s.id)];

  // Fetch products from API
  const allProducts = await fetchAllProducts();
  
  // Products of this category
  const categoryProducts = allProducts.filter((p) =>
    validIds.includes(p.category_id || "")
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="hidden md:block">
        <TopBar />
      </div>

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name, href: `/categories/${category.slug}` },
        ]}
      />

      <div className="container mx-auto px-0 pb-6">
        <CategoryPageClient
          category={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || undefined,
          }}
          initialProducts={categoryProducts}
          subCategories={subCats.map((s) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
          }))}
        />
      </div>
      <Footer /> 

    </main>
  );
}
