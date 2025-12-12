"use client";

import { useState } from "react";
import { MessageCircle, Mail, Phone, HelpCircle, AlertCircle, ExternalLink, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  title: string;
  status: "in_progress" | "resolved" | "pending";
  createdAt: string;
}

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "TKT-001",
    title: "Issue with order delivery",
    status: "in_progress",
    createdAt: "Dec 10, 2024",
  },
  {
    id: "TKT-002",
    title: "Product quality concern",
    status: "resolved",
    createdAt: "Dec 5, 2024",
  },
];

export function HelpSupport() {
  const [tickets] = useState<SupportTicket[]>(MOCK_TICKETS);

  const quickOptions = [
    { icon: MessageCircle, label: "Contact Support", href: "#" },
    { icon: AlertCircle, label: "Report Issue", href: "#" },
    { icon: ExternalLink, label: "FAQs", href: "#" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Support Options */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Support Options</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.label}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon size={18} className="text-gray-600" />
                <span className="font-medium text-gray-700">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Support Channels */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Channels</h3>
        
        <div className="space-y-4">
          {/* Chat Support */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Chat Support</h4>
              <p className="text-sm text-gray-600 mb-3">
                Get instant help from our support team. Available 24/7.
              </p>
              <button className="px-4 py-2 bg-[#001F5F] hover:bg-[#001845] text-white text-sm font-medium rounded-lg transition-colors">
                Start Chat
              </button>
            </div>
          </div>

          {/* Email Support */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <Mail size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Email Support</h4>
              <p className="text-sm text-gray-600 mb-2">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@exaltride.com"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                support@exaltride.com
              </a>
            </div>
          </div>

          {/* Call-back Request */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Phone size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Call-back Request</h4>
              <p className="text-sm text-gray-600 mb-3">
                Request a call back from our support team at your convenience.
              </p>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Request Call-back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Support Tickets */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Support Tickets</h3>
        
        {tickets.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No support tickets yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{ticket.id}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      getStatusColor(ticket.status)
                    )}>
                      {getStatusLabel(ticket.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{ticket.title}</p>
                  <p className="text-xs text-gray-400 mt-1">Created on {ticket.createdAt}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
