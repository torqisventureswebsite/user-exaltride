"use client";

import React from "react";
import { Filter } from "lucide-react";

export default function MobileFiltersButton({
  onOpen,
  totalResults,
}: {
  onOpen: () => void;
  totalResults: number;
}) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white text-sm shadow-sm"
      aria-label="Open filters"
    >
      <Filter className="h-4 w-4 text-gray-700" />
      <span className="font-medium">Filters</span>
      <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 rounded-md text-gray-700">
        {totalResults}
      </span>
    </button>
  );
}
