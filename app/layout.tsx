import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import { CartProvider } from "@/lib/cart/context";
import { CarProvider } from "@/lib/car/context";
import { LocationProvider } from "@/lib/location/context";
import { WishlistProvider } from "@/lib/wishlist/context";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { OAuthCallbackHandler } from "@/components/auth/OAuthCallbackHandler";

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  title: "ExaltRide - Premium E-Commerce",
  description: "Discover premium products for your lifestyle. High-quality, fast delivery.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interTight.variable}>
      <body className="antialiased">
        <AuthProvider>
          <LocationProvider>
            <CarProvider>
              <CartProvider>
                <WishlistProvider>
                  <Suspense fallback={null}>
                    <OAuthCallbackHandler />
                  </Suspense>
                  {children}
                  <Toaster position="top-right" richColors duration={1000} />
                </WishlistProvider>
              </CartProvider>
            </CarProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
