"use client";

import { Check } from "lucide-react";

interface KeyHighlightsProps {
  description?: string | null;
}

export default function KeyHighlights({ description }: KeyHighlightsProps) {
  // If no description, don't render the component
  if (!description) {
    return null;
  }

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm font-medium">
      <h3 className="text-lg font-semibold text-[#001F5F]">
        Product Description
      </h3>

      <div className="flex items-start gap-3 text-sm text-gray-700">
        <Check className="h-4 w-4 text-blue-700 mt-0.5 flex-shrink-0" />
        <p>{description}</p>
      </div>
    </div>
  );
}
