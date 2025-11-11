"use client";

// TODO: Connect to actual cart state when cart context is implemented
export function CartBadge() {
  // For now, using static count - will be replaced with dynamic cart count
  const itemCount: number = 3;

  if (itemCount === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center text-black">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
