"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  slug: string;
  title: string;
  primary_image: string;
  price: number;
  brand_name: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setSuggestions(data.products || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSearch} className="flex items-center border border-[#004AAD] rounded-full overflow-hidden shadow-sm bg-white">
        <div className="flex items-center pl-2 md:pl-3">
          <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder="Search products..."
          className="border-none focus:ring-0 flex-1 px-2 text-sm md:text-base text-gray-700 placeholder:text-gray-400 h-9 md:h-10"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-1.5 md:px-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
        )}
        <Button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-none rounded-r-full px-3 md:px-6 font-medium transition-colors text-sm md:text-base h-9 md:h-10"
        >
          <span className="hidden sm:inline">Search</span>
          <Search className="h-4 w-4 sm:hidden" />
        </Button>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="p-2 text-xs text-gray-500 border-b">
                Suggestions
              </div>
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded">
                    <Image
                      src={product.primary_image}
                      alt={product.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500">{product.brand_name}</p>
                  </div>
                  <div className="text-sm font-semibold text-blue-600">
                    ₹{product.price.toLocaleString()}
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setShowSuggestions(false)}
                className="block p-3 text-center text-sm text-blue-600 hover:bg-gray-50 font-medium"
              >
                View all results for "{query}"
              </Link>
            </>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No products found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
