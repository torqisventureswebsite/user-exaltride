"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

interface CarouselSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
}

const slides: CarouselSlide[] = [
  {
    id: "1",
    badge: "LIGHTNING DEALS",
    title: "Up to 80% OFF",
    subtitle: "Premium Touchscreen Units",
    image: "/images/image1.jpg",
  },
  {
    id: "2",
    badge: "HOT DEALS",
    title: "Up to 60% OFF",
    subtitle: "Engine Parts & Accessories",
    image: "/images/image2.jpg",
  },
  {
    id: "3",
    badge: "SPECIAL OFFER",
    title: "Up to 50% OFF",
    subtitle: "Brake System Components",
    image: "/images/image3.jpg",
  },
];

export function HeroCarousel() {
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
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.subtitle}
                  fill
                  className="object-cover"
                  priority={slide.id === "1"}
                />

                {/* Blue Overlay */}
                <div className="absolute inset-0 bg-[#001F5F]/80" />

                {/* Content */}
                <div className="relative flex h-full items-center px-4 md:px-8 lg:px-16">
                  <div className="max-w-2xl text-white">
                    {/* Badge */}
                    <Badge
                      variant="secondary"
                      className="mb-3 md:mb-6 gap-1 md:gap-1.5 bg-white/20 px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/30"
                    >
                      <Zap className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                      {slide.badge}
                    </Badge>

                    {/* Title */}
                    <h1 className="mb-2 md:mb-4 text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-4 md:mb-8 text-sm md:text-xl lg:text-2xl font-medium">
                      {slide.subtitle}
                    </p>

                    {/* CTA Button */}
                    <Link href="/products">
                      <Button
                        size="sm"
                        className="group gap-2 bg-white px-4 md:px-8 text-xs md:text-base font-semibold text-blue-600 hover:bg-gray-100 h-9 md:h-11"
                      >
                        Shop Now
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Bullet Navigation */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`
              w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300
              ${current === index 
                ? "bg-white scale-110" 
                : "bg-white/40 hover:bg-white/60"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
