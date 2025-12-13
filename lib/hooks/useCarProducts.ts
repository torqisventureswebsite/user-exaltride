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

  // Helper function to check if a product is compatible with user's car
  const checkCompatibility = useCallback((product: any, car: typeof selectedCar): boolean => {
    if (!car) return false;
    if (product.is_universal) return true;
    if (!product.compatible_cars || !Array.isArray(product.compatible_cars)) return false;
    
    return product.compatible_cars.some((c: CompatibleCar) =>
      c.make.toLowerCase() === car.make.toLowerCase() &&
      c.model.toLowerCase() === car.model.toLowerCase() &&
      c.year === car.year
    );
  }, []);

  // Map API response to CarProduct format
  const mapProduct = useCallback((p: any, car: typeof selectedCar): CarProduct => ({
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
    isCompatibleWithUserCar: car ? checkCompatibility(p, car) : false,
  }), [checkCompatibility]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build URL - always fetch products, optionally with car filter params
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      
      // Only add car params if a car is selected (for backend filtering/sorting)
      if (selectedCar?.id) {
        params.append("car_id", selectedCar.id);
        params.append("make", selectedCar.make);
        params.append("model", selectedCar.model);
        params.append("year", selectedCar.year.toString());
        if (selectedCar.variant) {
          params.append("variant", selectedCar.variant);
        }
      }

      const url = `${API_BASE_URL}/${endpoint}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      const fetchedProducts: CarProduct[] = (data.data || []).map((p: any) => mapProduct(p, selectedCar));

      // If car is selected, sort products: compatible ones first, then non-compatible
      if (selectedCar) {
        fetchedProducts.sort((a, b) => {
          if (a.isCompatibleWithUserCar && !b.isCompatibleWithUserCar) return -1;
          if (!a.isCompatibleWithUserCar && b.isCompatibleWithUserCar) return 1;
          return 0;
        });
      }

      // If API returns empty and we have initial products, use those instead
      if (fetchedProducts.length === 0 && initialProducts.length > 0) {
        const sortedInitial = [...initialProducts].map(p => ({
          ...p,
          isCompatibleWithUserCar: selectedCar ? checkCompatibility(p, selectedCar) : false,
        }));
        
        if (selectedCar) {
          sortedInitial.sort((a, b) => {
            if (a.isCompatibleWithUserCar && !b.isCompatibleWithUserCar) return -1;
            if (!a.isCompatibleWithUserCar && b.isCompatibleWithUserCar) return 1;
            return 0;
          });
        }
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
  }, [selectedCar, endpoint, limit, initialProducts, mapProduct, checkCompatibility]);

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
