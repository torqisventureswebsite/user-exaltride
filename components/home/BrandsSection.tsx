import Link from "next/link";
import { Button } from "@/components/ui/button";
import brandsData from "@/data/brands.json";
import { Music, Headphones, Wrench } from "lucide-react";

const brandIcons: Record<string, any> = {
  Sony: Music,
  Pioneer: Headphones,
  Bosch: Wrench,
  Philips: Music,
  JBL: Headphones,
  Blaupunkt: Music,
};

export function BrandsSection() {
  return (
    <section className="bg-white py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">Top Brands</h2>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
          {brandsData.map((brand) => {
            const Icon = brandIcons[brand.name] || Music;
            return (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 md:p-6 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <Icon className="h-8 w-8 md:h-10 md:w-10 text-gray-600 mb-2" />
                <span className="text-xs md:text-sm font-semibold text-gray-900 text-center">{brand.name}</span>
                <span className="text-[10px] md:text-xs text-gray-500 mt-1">{brand.item_count} items</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
