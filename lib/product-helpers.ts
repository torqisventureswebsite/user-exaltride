import { readFile } from "fs/promises";
import path from "path";

export interface Product {
  id: string;
  vendor_id: string;
  subbrand_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  sku: string;
  is_universal: boolean;
  price: number;
  compare_at_price: number;
  discount_percentage: number;
  stock: number;
  low_stock_threshold: number;
  brand_name: string;
  is_oem: boolean;
  warranty_months: number;
  weight_kg: number;
  dimensions_cm: string;
  images: string[];
  primary_image: string;
  video_url: string | null;
  return_policy: string;
  shipping_info: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  level: number;
  meta_title: string;
  meta_description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Load all products from JSON file
 */
export async function loadProducts(): Promise<Product[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json");
    const fileContents = await readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

/**
 * Load all categories from JSON file
 */
export async function loadCategories(): Promise<Category[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "categories.json");
    const fileContents = await readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

/**
 * Get product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find((p) => p.id === productId) || null;
}

/**
 * Get products by category ID
 */
export async function getProductsByCategory(
  categoryId: string,
  limit?: number,
  excludeIds: string[] = []
): Promise<Product[]> {
  const products = await loadProducts();
  let filtered = products.filter(
    (p) => p.category_id === categoryId && !excludeIds.includes(p.id)
  );
  
  if (limit) {
    filtered = filtered.slice(0, limit);
  }
  
  return filtered;
}

/**
 * Get similar products based on multiple category IDs
 */
export async function getSimilarProducts(
  categoryIds: string[],
  limit: number = 8,
  excludeIds: string[] = []
): Promise<Product[]> {
  const products = await loadProducts();
  
  // Filter products that belong to any of the given categories and are not in excludeIds
  const filtered = products.filter(
    (p) => categoryIds.includes(p.category_id) && !excludeIds.includes(p.id)
  );
  
  // Shuffle and limit
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

/**
 * Get category by ID
 */
export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const categories = await loadCategories();
  return categories.find((c) => c.id === categoryId) || null;
}
