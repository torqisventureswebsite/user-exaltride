"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Tag } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Mega Sale - Up to 60% OFF",
    subtitle: "Limited time offer on premium car accessories",
    cta: "Shop Now",
    image: "/images/offer1.png",
  },
  {
    id: 2,
    title: "Exclusive Deals on Audio Systems",
    subtitle: "Upgrade your drive with premium sound",
    cta: "Explore Now",
    image: "/images/offer2.png",
  },
  {
    id: 3,
    title: "Best Prices on Car Electronics",
    subtitle: "Top brands, unbeatable prices",
    cta: "Browse Deals",
    image: "/images/offer3.png",
  },
];

export default function CategoryOfferCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="w-full mb-8">
      <div className="relative ">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full rounded-xl"
        >
          <CarouselContent className="-ml-0 rounded-xl">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <div
                  className="relative h-[180px] md:h-[240px] w-full overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, #FBC84C 0%, #FFD666 50%, #FBC84C 100%)",
                  }}
                >
                  <div className="container mx-auto h-full flex items-center justify-between px-6 md:px-10">
                    {/* LEFT CONTENT */}
                    <div className="max-w-lg">
                      <h2 className="text-2xl md:text-4xl font-bold text-[#001F5F] mb-2 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-sm md:text-lg text-[#001F5F]/80 mb-4">
                        {slide.subtitle}
                      </p>
                      <Button className="bg-[#001F5F] hover:bg-[#001844] text-white font-semibold gap-2">
                        {slide.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* RIGHT IMAGE/ICON */}
                    <div className="relative w-[100px] h-[100px] md:w-[160px] md:h-[160px] shrink-0 bg-[#001F5F]/10 rounded-2xl flex items-center justify-center">
                      <Tag className="w-12 h-12 md:w-20 md:h-20 text-[#001F5F]" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Bullet Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`
                w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300
                ${current === index 
                  ? "bg-[#001F5F] scale-110" 
                  : "bg-[#001F5F]/30 hover:bg-[#001F5F]/50"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
