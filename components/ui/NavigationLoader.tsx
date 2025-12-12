"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When route changes, hide the loader
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Listen for navigation start events
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor) {
        const href = anchor.getAttribute("href");
        // Only show loader for internal navigation (not external links or hash links)
        if (href && href.startsWith("/") && !href.startsWith("/#") && href !== pathname) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#001F5F]" />
        <p className="text-sm text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
