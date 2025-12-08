"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Mega Sale - Up to 60% OFF",
    subtitle: "Limited time offer on premium car accessories",
    cta: "Shop Now ->",
    image: "/images/offer1.png",
  },
  {
    id: 2,
    title: "Exclusive Deals on Audio Systems",
    subtitle: "Upgrade your drive with premium sound",
    cta: "Explore Now ->",
    image: "/images/offer2.png",
  },
  {
    id: 3,
    title: "Best Prices on Car Electronics",
    subtitle: "Top brands, unbeatable prices",
    cta: "Browse Deals ->",
    image: "/images/offer3.png",
  },
];

export default function CategoryOfferCarousel() {
  return (
    <div className="w-full mb-8">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="relative w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
            <div
            className="relative h-[160px] md:h-[220px] w-screen overflow-hidden"
            style={{
                background:
                "linear-gradient(90deg, #FBC84C 0%, #FFD666 50%, #FBC84C 100%)",
            }}
            >

                <div className="h-full flex items-center justify-between px-6 md:px-10">
                  {/* LEFT CONTENT */}
                  <div className="max-w-lg">
                    <h2 className="text-xl md:text-3xl font-bold text-[#001F5F] mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-sm md:text-base text-[#001F5F] mb-4">
                      {slide.subtitle}
                    </p>
                    <Button className="bg-[#001F5F] hover:bg-[#001844] text-white">
                      {slide.cta}
                    </Button>
                  </div>

                  {/* RIGHT IMAGE */}
                  <div className="relative w-[120px] h-[120px] md:w-[170px] md:h-[170px] shrink-0">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* NAV CONTROLS */}
        <CarouselPrevious className="left-3 bg-white text-black shadow" />
        <CarouselNext className="right-3 bg-white text-black shadow" />
      </Carousel>
    </div>
  );
}
