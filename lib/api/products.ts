import { z } from "zod";

// API Response Schema
export const ApiProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  primary_image: z.string(),
  price: z.number(),
  compare_at_price: z.number().nullable().optional(),
  discount_percentage: z.string().nullable().optional(),
  rating: z.number().optional().default(0),
  review_count: z.number().optional().default(0),
  in_stock: z.boolean().optional().default(true),
  brand_name: z.string(),

  //category fix
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
});


export const ApiResponseSchema = z.object({
  data: z.array(ApiProductSchema),
  meta: z.object({
    limit: z.number().optional(),
    category: z.string().optional(),
    offset: z.number().optional(),
    has_more: z.boolean().optional(),
    total: z.number().optional(),
  }).optional(),
});

export type ApiProduct = z.infer<typeof ApiProductSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

// Compatible car type
export interface CompatibleCar {
  id: string;
  make: string;
  model: string;
  year: number;
  variant?: string;
  notes?: string;
}

// Product type that matches the app's existing structure
export interface Product {
  id: string;
  slug: string;
  title: string;
  primary_image: string;
  price: number;
  compare_at_price?: number | null;
  discount_percentage?: number | null;
  rating: number;
  review_count: number;
  in_stock?: boolean;
  brand_name: string;

  category?: {
    id: string;
    name: string;
    slug: string;
  };

  
  category_id?: string;

  description?: string;
  stock?: number;
  status?: string;
  sku?: string;
  warranty_months?: number;
  weight_kg?: number;
  dimensions_cm?: string;
  is_oem?: boolean;
  is_universal?: boolean;
  created_at?: string;
  updated_at?: string;
  images?: string[];
  compatible_cars?: CompatibleCar[];
}


const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1";

/**
 * Fetch products from the API
 */
export async function fetchProducts(params?: {
  limit?: number;
  offset?: number;
  category?: string;
}): Promise<{ products: Product[]; meta: ApiResponse["meta"] }> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.category) queryParams.append("category", params.category);

    const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    
    const response = await fetch(url, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText || 'Unknown error'}`);
    }

    const data = await response.json();
    const validated = ApiResponseSchema.parse(data);

    // Transform API products to app Product type
    const products: Product[] = validated.data.map((apiProduct) => ({
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      primary_image: apiProduct.primary_image,
      price: apiProduct.price,
      compare_at_price: apiProduct.compare_at_price,
      discount_percentage: apiProduct.discount_percentage
        ? parseFloat(apiProduct.discount_percentage)
        : null,
      rating: apiProduct.rating,
      review_count: apiProduct.review_count,
      in_stock: apiProduct.in_stock,
      brand_name: apiProduct.brand_name,
      stock: apiProduct.in_stock ? 100 : 0, // Default stock value
      status: apiProduct.in_stock ? "active" : "out_of_stock",
      category_id: apiProduct.category.id,
    }));

    return {
      products,
      meta: validated.meta || {
        limit: params?.limit || 100,
        category: params?.category || '',
        offset: params?.offset || 0,
        has_more: false,
        total: products.length,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Fetch all products (with pagination handling)
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  try {
    while (hasMore) {
      const { products, meta } = await fetchProducts({ limit, offset });
      allProducts.push(...products);
      hasMore = meta?.has_more ?? false;
      offset += limit;
      
      // Safety limit to prevent infinite loops
      if (offset > 10000) break;
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching all products:", error);
    // Return empty array on error to prevent app crashes
    return [];
  }
}

/**
 * Fetch a single product by slug from API endpoint
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json();
    
    // The API might return { data: product } or just the product
    const apiProduct = data.data || data;

    // Build product object directly from API response to preserve all fields
    const product: Product = {
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      primary_image: apiProduct.primary_image,
      price: apiProduct.price,
      compare_at_price: apiProduct.compare_at_price,
      discount_percentage: apiProduct.discount_percentage
        ? parseFloat(apiProduct.discount_percentage)
        : null,
      rating: apiProduct.rating ?? 0,
      review_count: apiProduct.review_count ?? 0,
      in_stock: apiProduct.in_stock ?? (apiProduct.stock > 0),
      brand_name: apiProduct.brand_name,
      stock: apiProduct.stock ?? 0,
      status: apiProduct.status ?? "active",
      description: apiProduct.description,
      sku: apiProduct.sku,
      warranty_months: apiProduct.warranty_months,
      weight_kg: apiProduct.weight_kg,
      dimensions_cm: apiProduct.dimensions_cm,
      is_oem: apiProduct.is_oem,
      is_universal: apiProduct.is_universal,
      images: apiProduct.images,
      category: apiProduct.category,
      compatible_cars: apiProduct.compatible_cars,
    };

    return product;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

/**
 * Fetch products by category
 */
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { products } = await fetchProducts({ category, limit: 100 });
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

/**
 * Fetch featured products from API endpoint
 */
export async function fetchFeaturedProducts(limit: number = 12): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/featured?limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured products: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = ApiResponseSchema.parse(data);

    const products: Product[] = validated.data.map((apiProduct) => ({
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      primary_image: apiProduct.primary_image,
      price: apiProduct.price,
      compare_at_price: apiProduct.compare_at_price,
      discount_percentage: apiProduct.discount_percentage
        ? parseFloat(apiProduct.discount_percentage)
        : null,
      rating: apiProduct.rating,
      review_count: apiProduct.review_count,
      in_stock: apiProduct.in_stock,
      brand_name: apiProduct.brand_name,
      stock: apiProduct.in_stock ? 100 : 0,
      status: apiProduct.in_stock ? "active" : "out_of_stock",
    }));

    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

/**
 * Fetch best-rated products
 */
export async function fetchBestRatedProducts(limit: number = 12): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/best-rated?limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch best-rated products: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = ApiResponseSchema.parse(data);

    const products: Product[] = validated.data.map((apiProduct) => ({
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      primary_image: apiProduct.primary_image,
      price: apiProduct.price,
      compare_at_price: apiProduct.compare_at_price,
      discount_percentage: apiProduct.discount_percentage
        ? parseFloat(apiProduct.discount_percentage)
        : null,
      rating: apiProduct.rating,
      review_count: apiProduct.review_count,
      in_stock: apiProduct.in_stock,
      brand_name: apiProduct.brand_name,
      stock: apiProduct.in_stock ? 100 : 0,
      status: apiProduct.in_stock ? "active" : "out_of_stock",
    }));

    return products;
  } catch (error) {
    console.error("Error fetching best-rated products:", error);
    return [];
  }
}

/**
 * Fetch new arrivals
 */
export async function fetchNewArrivals(limit: number = 12): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/new-arrivals?limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch new arrivals: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = ApiResponseSchema.parse(data);

    const products: Product[] = validated.data.map((apiProduct) => ({
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      primary_image: apiProduct.primary_image,
      price: apiProduct.price,
      compare_at_price: apiProduct.compare_at_price,
      discount_percentage: apiProduct.discount_percentage
        ? parseFloat(apiProduct.discount_percentage)
        : null,
      rating: apiProduct.rating,
      review_count: apiProduct.review_count,
      in_stock: apiProduct.in_stock,
      brand_name: apiProduct.brand_name,
      stock: apiProduct.in_stock ? 100 : 0,
      status: apiProduct.in_stock ? "active" : "out_of_stock",
    }));

    return products;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

/**
 * Fetch best-selling products
 */
export async function fetchBestSellingProducts(limit: number = 12): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/best-selling?limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch best-selling products: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = ApiResponseSchema.parse(data);

    const products: Product[] = validated.data.map((apiProduct) => ({
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      primary_image: apiProduct.primary_image,
      price: apiProduct.price,
      compare_at_price: apiProduct.compare_at_price,
      discount_percentage: apiProduct.discount_percentage
        ? parseFloat(apiProduct.discount_percentage)
        : null,
      rating: apiProduct.rating,
      review_count: apiProduct.review_count,
      in_stock: apiProduct.in_stock,
      brand_name: apiProduct.brand_name,
      stock: apiProduct.in_stock ? 100 : 0,
      status: apiProduct.in_stock ? "active" : "out_of_stock",
    }));

    return products;
  } catch (error) {
    console.error("Error fetching best-selling products:", error);
    return [];
  }
}

/**
 * Fetch top deals
 */
export async function fetchTopDeals(limit: number = 12): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/top-deals?limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top deals: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = ApiResponseSchema.parse(data);

    const products: Product[] = validated.data.map((apiProduct) => ({
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      primary_image: apiProduct.primary_image,
      price: apiProduct.price,
      compare_at_price: apiProduct.compare_at_price,
      discount_percentage: apiProduct.discount_percentage
        ? parseFloat(apiProduct.discount_percentage)
        : null,
      rating: apiProduct.rating,
      review_count: apiProduct.review_count,
      in_stock: apiProduct.in_stock,
      brand_name: apiProduct.brand_name,
      stock: apiProduct.in_stock ? 100 : 0,
      status: apiProduct.in_stock ? "active" : "out_of_stock",
    }));

    return products;
  } catch (error) {
    console.error("Error fetching top deals:", error);
    return [];
  }
}

/**
 * Fetch related products for a product
 */
export async function fetchRelatedProducts(slug: string, limit: number = 4): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}/related?limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch related products: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = ApiResponseSchema.parse(data);

    const products: Product[] = validated.data.map((apiProduct) => ({
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      primary_image: apiProduct.primary_image,
      price: apiProduct.price,
      compare_at_price: apiProduct.compare_at_price,
      discount_percentage: apiProduct.discount_percentage
        ? parseFloat(apiProduct.discount_percentage)
        : null,
      rating: apiProduct.rating,
      review_count: apiProduct.review_count,
      in_stock: apiProduct.in_stock,
      brand_name: apiProduct.brand_name,
      stock: apiProduct.in_stock ? 100 : 0,
      status: apiProduct.in_stock ? "active" : "out_of_stock",
    }));

    return products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

/**
 * Homepage API response types
 */
export interface HomepageCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  product_count: number;
}

export interface HomepageBrand {
  id: string;
  name: string;
  slug: string;
  product_count: number;
  total_reviews: number;
}

export interface HomepageData {
  best_selling: Product[];
  shop_by_categories: HomepageCategory[];
  top_brands: HomepageBrand[];
  top_deals: Product[];
  best_rated: Product[];
}

/**
 * Fetch homepage data from the unified homepage API
 */
export async function fetchHomepageData(): Promise<HomepageData> {
  try {
    const response = await fetch(`${API_BASE_URL}/homepage`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Homepage API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch homepage data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Homepage API raw response keys:", Object.keys(data));

    // Transform products to match our Product interface
    const transformProduct = (apiProduct: any): Product => ({
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      primary_image: apiProduct.primary_image,
      price: apiProduct.price,
      compare_at_price: apiProduct.compare_at_price,
      discount_percentage: apiProduct.discount_percentage
        ? parseFloat(String(apiProduct.discount_percentage))
        : null,
      rating: apiProduct.rating ?? 0,
      review_count: apiProduct.review_count ?? 0,
      in_stock: apiProduct.in_stock ?? true,
      brand_name: apiProduct.brand_name,
      stock: apiProduct.in_stock ? 100 : 0,
      status: apiProduct.in_stock ? "active" : "out_of_stock",
    });

    return {
      best_selling: (data.best_selling || []).map(transformProduct),
      shop_by_categories: data.shop_by_categories || [],
      top_brands: data.top_brands || [],
      top_deals: (data.top_deals || []).map(transformProduct),
      best_rated: (data.best_rated || []).map(transformProduct),
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      best_selling: [],
      shop_by_categories: [],
      top_brands: [],
      top_deals: [],
      best_rated: [],
    };
  }
}
