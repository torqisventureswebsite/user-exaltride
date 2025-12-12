"use client";

export interface SavedItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  categoryId?: string;
  slug?: string;
  savedAt: number;
}

const SAVED_FOR_LATER_KEY = "saved_for_later";

export function getSavedItems(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(SAVED_FOR_LATER_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveForLater(item: Omit<SavedItem, "savedAt">): void {
  if (typeof window === "undefined") return;
  const items = getSavedItems();
  const existingIndex = items.findIndex((i) => i.productId === item.productId);
  
  if (existingIndex === -1) {
    items.push({ ...item, savedAt: Date.now() });
    localStorage.setItem(SAVED_FOR_LATER_KEY, JSON.stringify(items));
  }
}

export function removeFromSaved(productId: string): void {
  if (typeof window === "undefined") return;
  const items = getSavedItems().filter((item) => item.productId !== productId);
  localStorage.setItem(SAVED_FOR_LATER_KEY, JSON.stringify(items));
}

export function clearSavedItems(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SAVED_FOR_LATER_KEY);
}

export function isItemSaved(productId: string): boolean {
  return getSavedItems().some((item) => item.productId === productId);
}
