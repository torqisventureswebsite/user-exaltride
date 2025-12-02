// app/categories/[slug]/page.tsx
import categories from "@/data/categories.json";
import products from "@/data/products.json";
import { notFound } from "next/navigation";
import CategoryPageClient from "@/components/categories/CategoryPageClient";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import CategoryExtras from "@/components/category-sections/CategoryExtras";
import Footer from "@/components/layout/Footer";
export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  // NEXT 15/16: params is NOW A PROMISE → MUST AWAIT
  const { slug } = await props.params;

  // Find category
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  // Subcategories
  const subCats = categories.filter((c) => c.parent_id === category.id);

  // Parent + children IDs
  const validIds = [category.id, ...subCats.map((s) => s.id)];

  // Products of this category
  const categoryProducts = products.filter((p) =>
    validIds.includes(p.category_id)
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

      <div className="container mx-auto px-4 py-6">
        <CategoryPageClient
          category={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
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
