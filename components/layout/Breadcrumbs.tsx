import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <nav className="w-full bg-white py-3 border-b">
      <div className="container mx-auto px-4 flex items-center text-sm text-gray-600">
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <Link
              href={{ pathname: item.href }}
              className="hover:text-blue-600"
            >
              {item.label}
            </Link>

            {index !== items.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
