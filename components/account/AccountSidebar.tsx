"use client";

import { Package, Shield, MapPin, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccountSection = "orders" | "security" | "addresses" | "support";

interface AccountSidebarProps {
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
}

const menuItems = [
  { id: "orders" as const, label: "My Orders", icon: Package },
  { id: "security" as const, label: "Login & Security", icon: Shield },
  { id: "addresses" as const, label: "Your Addresses", icon: MapPin },
  { id: "support" as const, label: "Help & Support", icon: HelpCircle },
];

export function AccountSidebar({ activeSection, onSectionChange }: AccountSidebarProps) {
  return (
    <div className="w-full lg:w-56 shrink-0">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Your Account</h2>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#001F5F] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
