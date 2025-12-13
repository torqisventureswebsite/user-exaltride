"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, HelpCircle } from "lucide-react";

export default function CategoryHero({
  name,
  productCount,
  description,
}: {
  name: string;
  productCount: number;
  description?: string;
}) {
  return (
    <section
      className="w-full bg-[#001F5F] text-white px-4 py-4 md:py-8 md:px-6"
    >
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4"
      >
        <div>
          <h1 className="text-xl font-bold md:text-3xl">{name}</h1>
        </div>

      </div>
    </section>
  );
}
