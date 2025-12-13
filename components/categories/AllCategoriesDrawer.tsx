"use client";

import Link from "next/link";
import { X, ChevronRight, Layers, Sparkles } from "lucide-react";
import Image from "next/image";

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  "engine-parts": "🔧",
  "brakes": "🛞",
  "filters": "🔍",
  "batteries": "🔋",
  "lights": "💡",
  "tyres": "⚫",
  "accessories": "🎯",
  "oils": "🛢️",
  "suspension": "🔩",
  "electrical": "⚡",
};

export default function AllCategoriesDrawer({ open, onClose, categories }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-[85%] max-w-[340px] bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#001F5F] rounded-xl flex items-center justify-center">
                <Layers size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Categories</h2>
                <p className="text-xs text-gray-500">Browse all products</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Layers size={24} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No categories found</p>
            </div>
          ) : (
            categories.map((cat: any, index: number) => {
              const icon = categoryIcons[cat.slug] || "📦";
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onClick={onClose}
                >
                  <div className="group flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:translate-x-1">
                    <div className="w-11 h-11 bg-gray-100 group-hover:bg-[#001F5F]/10 rounded-lg flex items-center justify-center text-xl transition-colors">
                      {icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-[#001F5F] transition-colors">
                        {cat.name}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#001F5F] transition-colors" />
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link href="/products" onClick={onClose}>
            <button className="w-full flex items-center justify-center gap-2 bg-[#001F5F] hover:bg-[#001F5F]/90 text-white font-semibold py-3 rounded-xl transition-colors">
              View All Products
              <ChevronRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
