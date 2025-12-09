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
      <div className="absolute left-0 top-0 h-full w-[85%] max-w-[340px] bg-gradient-to-b from-[#001F5F] to-[#000B3D] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Layers size={20} className="text-[#001F5F]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Categories</h2>
                <p className="text-xs text-white/50">Browse all products</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Featured Banner */}
        <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-yellow-400/20 to-yellow-500/10 border border-yellow-400/30 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Featured</span>
          </div>
          <p className="text-sm text-white/80">
            Explore our top categories with exclusive deals!
          </p>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Layers size={24} className="text-white/40" />
              </div>
              <p className="text-sm text-white/50">No categories found</p>
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
                  <div className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 hover:translate-x-1">
                    <div className="w-11 h-11 bg-white/10 group-hover:bg-yellow-400/20 rounded-lg flex items-center justify-center text-xl transition-colors">
                      {icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                        {cat.name}
                      </p>
                      {cat.product_count && (
                        <p className="text-xs text-white/40">
                          {cat.product_count} products
                        </p>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-white/30 group-hover:text-yellow-400 transition-colors" />
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <Link href="/products" onClick={onClose}>
            <button className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#001F5F] font-semibold py-3 rounded-xl transition-colors">
              View All Products
              <ChevronRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
