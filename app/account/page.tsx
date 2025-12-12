"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  AccountSidebar,
  AccountSection,
  MyOrders,
  MyWishlist,
  LoginSecurity,
  YourAddresses,
  HelpSupport,
} from "@/components/account";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>("orders");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001F5F]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "orders":
        return <MyOrders />;
      case "wishlist":
        return <MyWishlist />;
      case "security":
        return <LoginSecurity />;
      case "addresses":
        return <YourAddresses />;
      case "support":
        return <HelpSupport />;
      default:
        return <MyOrders />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Account</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <AccountSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
