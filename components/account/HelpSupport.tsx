"use client";

import { useState } from "react";
import { Mail, HelpCircle, ChevronDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  orderId: string;
  title: string;
  status: "in_progress" | "resolved" | "pending";
  createdAt: string;
}

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "TKT-001",
    orderId: "ORD-2024-001",
    title: "Issue with order delivery",
    status: "in_progress",
    createdAt: "Dec 10, 2024",
  },
  {
    id: "TKT-002",
    orderId: "ORD-2024-002",
    title: "Product quality concern",
    status: "resolved",
    createdAt: "Dec 5, 2024",
  },
];

const ISSUE_TYPES = [
  "Order not received",
  "Wrong item delivered",
  "Damaged product",
  "Refund request",
  "Payment issue",
  "Other",
];

const FAQS = [
  { question: "How do I create an account?", answer: "You can create an account by clicking on the 'Login' button and selecting 'Sign Up'. Fill in your details and verify your email to complete registration." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit/debit cards, UPI, Net Banking, and popular wallets like Paytm and PhonePe." },
  { question: "How can I track my order without logging in?", answer: "You can track your order using the tracking link sent to your email or by entering your order ID on our Track Order page." },
  { question: "Do you ship internationally?", answer: "Currently, we only ship within India. International shipping will be available soon." },
  { question: "What is your return policy?", answer: "We offer a 7-day return policy for most products. Items must be unused and in original packaging." },
  { question: "How long does delivery take?", answer: "Standard delivery takes 3-7 business days. Express delivery is available for select locations with 1-2 day delivery." },
  { question: "Can I modify my order after placing it?", answer: "Orders can be modified within 1 hour of placing them. Contact support immediately if you need to make changes." },
  { question: "How do I apply a coupon code?", answer: "Enter your coupon code in the 'Apply Coupon' field on the cart page and click Apply. The discount will be reflected in your total." },
];

export function HelpSupport() {
  const [tickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "resolved":
        return "bg-green-100 text-green-700 border border-green-200";
      case "pending":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ selectedOrder, issueType, description });
  };

  return (
    <div className="space-y-6">
      {/* Email Support Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#001F5F] flex items-center justify-center">
            <Mail size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
            <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Order <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent text-sm bg-white appearance-none cursor-pointer"
              >
                <option value="">Choose an order...</option>
                <option value="ORD-2024-001">ORD-2024-001 - Dec 10, 2024</option>
                <option value="ORD-2024-002">ORD-2024-002 - Dec 5, 2024</option>
                <option value="ORD-2024-003">ORD-2024-003 - Nov 28, 2024</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Issue Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent text-sm bg-white appearance-none cursor-pointer"
              >
                <option value="">Select issue type...</option>
                {ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Describe Your Issue <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed information about your issue. Include order details, product condition, or any other relevant info..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent text-sm resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 20 characters required</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedOrder || !issueType || description.length < 20}
            className="w-full flex items-center justify-center gap-2 bg-[#001F5F] hover:bg-[#001845] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            <Send size={18} />
            Submit Support Request
          </button>
        </form>
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
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{ticket.id}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      getStatusColor(ticket.status)
                    )}>
                      {getStatusLabel(ticket.status)}
                    </span>
                    <span className="text-xs text-gray-500">⊕ {ticket.orderId}</span>
                  </div>
                  <p className="text-sm text-gray-700">{ticket.title}</p>
                  <p className="text-xs text-gray-400 mt-1">Created on {ticket.createdAt}</p>
                </div>
                <button className="px-4 py-2 border-2 border-[#001F5F] text-[#001F5F] text-sm font-semibold rounded-lg hover:bg-[#001F5F] hover:text-white transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
        <p className="text-sm text-gray-500 mb-4">Find answers to common questions not related to specific orders</p>
        
        <div className="space-y-2">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "text-gray-400 transition-transform",
                    expandedFaq === index && "rotate-180"
                  )}
                />
              </button>
              {expandedFaq === index && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
