"use client";

import Link from "next/link";

export default function AllCategoriesDrawer({ open, onClose, categories }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50">
      <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">All Categories</h2>

        {categories.length === 0 && (
          <p className="text-sm text-gray-500">No categories found.</p>
        )}

        <div className="flex flex-col gap-2">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="text-gray-700 hover:text-blue-600 text-sm"
              onClick={onClose}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Background click closes drawer */}
      <div className="w-full h-full" onClick={onClose} />
    </div>
  );
}
