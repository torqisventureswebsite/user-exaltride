"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="relative w-full"
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[500px] w-full overflow-hidden">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.subtitle}
                fill
                className="object-cover"
                priority={slide.id === "1"}
              />

              {/* Blue Overlay */}
              <div className="absolute inset-0 bg-blue-600/80" />

              {/* Content */}
              <div className="relative flex h-full items-center px-8 md:px-16">
                <div className="max-w-2xl text-white">
                  {/* Badge */}
                  <Badge
                    variant="secondary"
                    className="mb-6 gap-1.5 bg-white/20 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/30"
                  >
                    <Zap className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {slide.badge}
                  </Badge>

                  {/* Title */}
                  <h1 className="mb-4 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="mb-8 text-xl font-medium md:text-2xl">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="group gap-2 bg-white px-8 text-base font-semibold text-blue-600 hover:bg-gray-100"
                    >
                      Shop Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation Arrows */}
      <CarouselPrevious className="left-4 h-12 w-12 border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" />
      <CarouselNext className="right-4 h-12 w-12 border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" />
    </Carousel>
  );
}
