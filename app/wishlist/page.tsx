import { Suspense } from "react";
import WishlistContent from "./WishlistContent";

export const metadata = {
  title: "My Wishlist | ExaltRide",
  description: "View and manage your wishlist items",
};

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistSkeleton />}>
      <WishlistContent />
    </Suspense>
  );
}

function WishlistSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="aspect-square bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
