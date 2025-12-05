import { z } from "zod";

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1";

// Category Schema
export const ApiCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  parent_id: z.string().optional().nullable(),
  level: z.number().optional(),
  item_count: z.number().optional(),
});

export const ApiCategoriesResponseSchema = z.object({
  data: z.array(ApiCategorySchema),
  meta: z.object({
    total: z.number(),
  }).optional(),
});

export type ApiCategory = z.infer<typeof ApiCategorySchema>;
export type Category = ApiCategory;

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = ApiCategoriesResponseSchema.parse(data);

    return validated.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch a single category by slug
 */
export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();

    // API returns { data: [...] }
    const list = json.data || json;

    if (!Array.isArray(list)) {
      console.error("Categories API did not return an array:", json);
      return null;
    }

    const match = list.find((c: any) => c.slug === slug);
    if (!match) return null;

    return ApiCategorySchema.parse(match);
  } catch (err) {
    console.error("Error fetching category:", err);
    return null;
  }
}

/**
 * Get top-level categories (level 0)
 */
export async function fetchTopLevelCategories(): Promise<Category[]> {
  const categories = await fetchCategories();
  return categories.filter((c) => c.level === 0 || !c.parent_id);
}

/**
 * Get subcategories for a parent category
 */
export async function fetchSubcategories(parentId: string): Promise<Category[]> {
  const categories = await fetchCategories();
  return categories.filter((c) => c.parent_id === parentId);
}
