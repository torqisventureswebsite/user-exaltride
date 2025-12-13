"use client";

import { useState, useEffect, useCallback } from "react";
import { useCar } from "@/lib/car/context";

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1";

// Compatible car type
interface CompatibleCar {
  id: string;
  make: string;
  model: string;
  year: number;
  variant?: string;
  notes?: string;
}

// Product type that works with both API and component Product types
export interface CarProduct {
  id: string;
  slug?: string;
  title: string;
  primary_image: string;
  price: number;
  compare_at_price?: number | null;
  discount_percentage?: number | null;
  rating?: number;
  review_count?: number;
  in_stock?: boolean;
  brand_name: string;
  stock?: number;
  status?: string;
  category_id?: string;
  description?: string;
  compatible_cars?: CompatibleCar[];
  is_universal?: boolean;
  isCompatibleWithUserCar?: boolean;
}

interface UseCarProductsOptions {
  endpoint: string; // e.g., "products", "products/best-selling", "products/top-deals"
  limit?: number;
  initialProducts?: CarProduct[];
}

interface UseCarProductsResult {
  products: CarProduct[];
  isLoading: boolean;
  error: string | null;
  hasCarFilter: boolean;
}

export function useCarProducts({
  endpoint,
  limit = 12,
  initialProducts = [],
}: UseCarProductsOptions): UseCarProductsResult {
  const { selectedCar } = useCar();
  const [products, setProducts] = useState<CarProduct[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchProducts = useCallback(async () => {
    // Only fetch if a car is selected
    if (!selectedCar?.id) {
      // Reset to initial products when no car is selected
      setProducts(initialProducts);
      setHasFetched(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      // Send all car attributes for exact AND matching
      params.append("car_id", selectedCar.id);
      params.append("make", selectedCar.make);
      params.append("model", selectedCar.model);
      params.append("year", selectedCar.year.toString());
      if (selectedCar.variant) {
        params.append("variant", selectedCar.variant);
      }

      const url = `${API_BASE_URL}/${endpoint}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Helper function to check if a product is compatible with user's car
      const checkCompatibility = (product: any): boolean => {
        if (product.is_universal) return true;
        if (!product.compatible_cars || !Array.isArray(product.compatible_cars)) return false;
        
        return product.compatible_cars.some((car: CompatibleCar) =>
          car.make.toLowerCase() === selectedCar.make.toLowerCase() &&
          car.model.toLowerCase() === selectedCar.model.toLowerCase() &&
          car.year === selectedCar.year
        );
      };

      const fetchedProducts: CarProduct[] = (data.data || []).map((p: any) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        primary_image: p.primary_image,
        price: p.price,
        compare_at_price: p.compare_at_price,
        discount_percentage: p.discount_percentage ? parseFloat(p.discount_percentage) : null,
        rating: p.rating ?? 0,
        review_count: p.review_count ?? 0,
        in_stock: p.in_stock ?? true,
        brand_name: p.brand_name,
        stock: p.in_stock ? 100 : 0,
        status: p.in_stock ? "active" : "out_of_stock",
        category_id: p.category?.id,
        compatible_cars: p.compatible_cars,
        is_universal: p.is_universal,
        isCompatibleWithUserCar: checkCompatibility(p),
      }));

      // Sort products: compatible ones first, then non-compatible
      fetchedProducts.sort((a, b) => {
        if (a.isCompatibleWithUserCar && !b.isCompatibleWithUserCar) return -1;
        if (!a.isCompatibleWithUserCar && b.isCompatibleWithUserCar) return 1;
        return 0;
      });

      // If car filter returns empty, fall back to initial products (also sorted)
      if (fetchedProducts.length === 0) {
        // Sort initial products by compatibility too
        const sortedInitial = [...initialProducts].map(p => ({
          ...p,
          isCompatibleWithUserCar: checkCompatibility(p),
        })).sort((a, b) => {
          if (a.isCompatibleWithUserCar && !b.isCompatibleWithUserCar) return -1;
          if (!a.isCompatibleWithUserCar && b.isCompatibleWithUserCar) return 1;
          return 0;
        });
        setProducts(sortedInitial);
      } else {
        setProducts(fetchedProducts);
      }
      setHasFetched(true);
    } catch (err) {
      console.error("Error fetching car products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      // Fall back to initial products on error
      setProducts(initialProducts);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCar?.id, endpoint, limit, initialProducts]);

  // Fetch products only when car selection changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCar?.id]); // Only depend on selectedCar.id, not the whole fetchProducts function

  // Also listen for carChanged event
  useEffect(() => {
    const handleCarChange = () => {
      fetchProducts();
    };

    window.addEventListener("carChanged", handleCarChange);
    return () => window.removeEventListener("carChanged", handleCarChange);
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    hasCarFilter: !!selectedCar,
  };
}
