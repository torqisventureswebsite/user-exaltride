"use client";

import { useState } from "react";
import { FileText, Package, GitCompare, Settings, Star, Check } from "lucide-react";
import CustomerReviews from "./CustomerReviews";

interface ProductTabsProps {
  description?: string;
  warrantyMonths?: number;
  productId: string;
  rating?: number;
  reviewCount?: number;
}

type TabId = "about" | "whats-in-box" | "compare" | "specs" | "reviews";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "about", label: "About This Item", icon: <FileText className="h-4 w-4" /> },
  { id: "whats-in-box", label: "What's in the Box", icon: <Package className="h-4 w-4" /> },
  { id: "compare", label: "Compare Products", icon: <GitCompare className="h-4 w-4" /> },
  { id: "specs", label: "Technical Specs", icon: <Settings className="h-4 w-4" /> },
  { id: "reviews", label: "Customer Reviews", icon: <Star className="h-4 w-4" /> },
];

export default function ProductTabs({ 
  description, 
  warrantyMonths, 
  productId,
  rating = 0,
  reviewCount = 0,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("about");

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">PRODUCT DESCRIPTION</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {description || "Product description not available."}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">WARRANTY & SUPPORT</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{warrantyMonths ? `${warrantyMonths} months warranty` : "Warranty information not available"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Dedicated customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "whats-in-box":
        return (
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">WHAT'S INCLUDED</h4>
            <p className="text-sm text-gray-600">
              Package contents information not available for this product.
            </p>
          </div>
        );

      case "compare":
        return (
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">COMPARE PRODUCTS</h4>
            <p className="text-sm text-gray-600">
              Product comparison feature coming soon.
            </p>
          </div>
        );

      case "specs":
        return (
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">TECHNICAL SPECIFICATIONS</h4>
            <p className="text-sm text-gray-600">
              Technical specifications not available for this product.
            </p>
          </div>
        );

      case "reviews":
        return (
          <CustomerReviews 
            productId={productId} 
            rating={rating}
            reviewCount={reviewCount}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      {/* Tab Headers */}
      <div className="flex overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-[#001F5F] border-b-2 border-[#001F5F] bg-blue-50/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
