"use client";

import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <TopBar />
      <CheckoutContent />
      <Footer />
    </div>
  );
}
