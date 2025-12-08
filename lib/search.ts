import { fetchAllProducts } from "./api/products";

export interface SearchProduct {
  id: string;
  slug: string;
  title: string;
  primary_image: string;
  price: number;
  brand_name: string;
  rating: number;
  in_stock?: boolean;
}

export interface SearchResult {
  products: SearchProduct[];
  total: number;
  query: string;
}

/**
 * Search products by query
 * Searches across product title, brand name, and SKU
 */
export async function searchProducts(
  query: string,
  limit: number = 10
): Promise<SearchResult> {
  try {
    // Fetch all products from API
    const allProducts = await fetchAllProducts();
    
    const lowerQuery = query.toLowerCase().trim();
    
    // Filter products based on search query
    const filteredProducts = allProducts.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(lowerQuery);
      const brandMatch = product.brand_name.toLowerCase().includes(lowerQuery);
      const skuMatch = product.sku?.toLowerCase().includes(lowerQuery);
      
      return titleMatch || brandMatch || skuMatch;
    });

    // Sort by relevance (exact matches first, then partial matches)
    const sortedProducts = filteredProducts.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // Exact title match gets highest priority
      if (aTitle === lowerQuery) return -1;
      if (bTitle === lowerQuery) return 1;
      
      // Title starts with query gets second priority
      if (aTitle.startsWith(lowerQuery)) return -1;
      if (bTitle.startsWith(lowerQuery)) return 1;
      
      // Then sort by rating
      return (b.rating || 0) - (a.rating || 0);
    });

    // Limit results
    const limitedProducts = sortedProducts.slice(0, limit);

    return {
      products: limitedProducts,
      total: filteredProducts.length,
      query,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      products: [],
      total: 0,
      query,
    };
  }
}
