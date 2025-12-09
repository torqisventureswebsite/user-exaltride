import { z } from "zod";
import { ApiProductSchema, type Product } from "./products";

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1";

// Brand Schema
export const ApiBrandSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  product_count: z.number().optional(),
});

export const ApiBrandsResponseSchema = z.object({
  data: z.array(ApiBrandSchema),
  meta: z.object({
    total: z.number(),
  }).optional(),
});

export const ApiBrandProductsResponseSchema = z.object({
  data: z.array(ApiProductSchema),
  meta: z.object({
    limit: z.number(),
    offset: z.number(),
    has_more: z.boolean(),
    total: z.number(),
  }),
});

export type ApiBrand = z.infer<typeof ApiBrandSchema>;
export type Brand = ApiBrand;

/**
 * Fetch all brands
 */
export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = ApiBrandsResponseSchema.parse(data);

    return validated.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

/**
 * Fetch products for a specific brand
 */
export async function fetchBrandProducts(
  brandSlug: string,
  params?: {
    limit?: number;
    offset?: number;
  }
): Promise<{ products: Product[]; meta: { limit: number; offset: number; has_more: boolean; total: number } }> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const url = `${API_BASE_URL}/brands/${brandSlug}/products${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch brand products: ${response.statusText}`);
    }

const data = await response.json();

// ✅ TEMP: bypass Zod for brand products
const validated = data as any;

const products: Product[] = validated.data.map((apiProduct: any) => ({
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


    return {
      products,
      meta: validated.meta,
    };
  } catch (error) {
    console.error(`Error fetching products for brand ${brandSlug}:`, error);
    return {
      products: [],
      meta: { limit: 0, offset: 0, has_more: false, total: 0 },
    };
  }
}

/**
 * Fetch all products for a brand (with pagination handling)
 */
export async function fetchAllBrandProducts(brandSlug: string): Promise<Product[]> {
  const allProducts: Product[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  try {
    while (hasMore) {
      const { products, meta } = await fetchBrandProducts(brandSlug, { limit, offset });
      allProducts.push(...products);
      hasMore = meta.has_more;
      offset += limit;

      // Safety limit
      if (offset > 10000) break;
    }

    return allProducts;
  } catch (error) {
    console.error(`Error fetching all products for brand ${brandSlug}:`, error);
    return [];
  }
}
