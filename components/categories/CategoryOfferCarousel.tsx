import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag } from "lucide-react";

export default function CategoryOfferCarousel() {
  return (
    <div className="w-full mb-4 md:mb-8">
      <div
        className="relative h-[160px] md:h-[200px] w-full overflow-hidden md:rounded-b-xl"
        style={{
          background:
            "linear-gradient(90deg, #FBC84C 0%, #FFD666 50%, #FBC84C 100%)",
        }}
      >
        <div className="h-full flex items-center justify-between px-4 md:px-10">
          {/* LEFT CONTENT */}
          <div className="max-w-[65%] md:max-w-lg">
            <h2 className="text-lg md:text-3xl font-bold text-[#001F5F] mb-1 md:mb-2 leading-tight">
              Best Prices on Car Electronics
            </h2>
            <p className="text-xs md:text-base text-[#001F5F]/80 mb-2 md:mb-4">
              Top brands, unbeatable prices
            </p>
            <Link href={"/collections/deals" as any}>
              <Button className="bg-[#001F5F] hover:bg-[#001844] text-white font-semibold gap-2 text-xs md:text-sm h-8 md:h-10 px-3 md:px-4">
                Browse Deals
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </Link>
          </div>

          {/* RIGHT IMAGE/ICON */}
          <div className="relative w-[70px] h-[70px] md:w-[140px] md:h-[140px] shrink-0 bg-[#001F5F]/10 rounded-xl md:rounded-2xl flex items-center justify-center">
            <Tag className="w-8 h-8 md:w-16 md:h-16 text-[#001F5F]" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
