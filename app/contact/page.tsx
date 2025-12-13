"use client";

import { useState } from "react";
import { Mail, Phone, Clock, Headphones } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Clock, Headphones, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24-48 hours",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TopBar />

      {/* Page Header */}
      <div className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#001F5F] mb-3">Contact Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Have questions or need assistance? We're here to help you every step of the way.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column - Contact Info Cards */}
          <div className="space-y-6">
            {/* Hero Card with Image */}
            <div className="relative rounded-2xl overflow-hidden h-[280px] md:h-[320px]">
              <Image
                src="/images/image1.jpg"
                alt="Customer Support"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">We're Here to Help</h2>
                <p className="text-white/80 text-sm md:text-base">
                  Our dedicated team is ready to assist you with any questions or concerns.
                </p>
              </div>
            </div>

            {/* Contact Cards Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#001F5F] rounded-xl p-5 text-white">
                <div className="w-10 h-10 bg-[#FBC84C] rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-[#001F5F]" />
                </div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-white/70 text-sm">support@exaltride.com</p>
              </div>

              <div className="bg-[#001F5F] rounded-xl p-5 text-white">
                <div className="w-10 h-10 bg-[#FBC84C] rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-[#001F5F]" />
                </div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-white/70 text-sm">+91 1800-XXX-XXXX</p>
              </div>
            </div>

            {/* Quick Response Card with Image */}
            <div className="relative rounded-2xl overflow-hidden h-[240px] md:h-[280px]">
              <Image
                src="/images/image2.jpg"
                alt="Quick Response"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones className="w-5 h-5 text-[#FBC84C]" />
                  <span className="font-semibold">Quick Response Time</span>
                </div>
                <p className="text-white/80 text-sm">
                  We typically respond within 24-48 business hours. Your satisfaction is our priority.
                </p>
              </div>
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-[#001F5F]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                <p className="text-gray-600 text-sm">Mon-Fri: 9 AM - 7 PM</p>
                <p className="text-gray-600 text-sm">Sat: 10 AM - 5 PM</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <Headphones className="w-5 h-5 text-[#001F5F]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
                <p className="text-gray-600 text-sm">Online support portal and live chat available.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-gray-500 mb-6">
              Fill out the form below and we'll get back to you soon.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11 border-gray-300 focus:border-[#001F5F] focus:ring-[#001F5F]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 border-gray-300 focus:border-[#001F5F] focus:ring-[#001F5F]"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11 border-gray-300 focus:border-[#001F5F] focus:ring-[#001F5F]"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-11 rounded-md border border-gray-300 px-3 pr-10 text-gray-900 focus:border-[#001F5F] focus:outline-none focus:ring-1 focus:ring-[#001F5F] appearance-none bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="product">Product Question</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Please provide details about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 focus:border-[#001F5F] focus:outline-none focus:ring-1 focus:ring-[#001F5F] resize-none"
                  required
                />
              </div>

              {/* Note */}
              <div className="bg-[#FFF8E7] border border-[#FBC84C]/30 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Note:</span> All fields marked with <span className="text-red-500">*</span> are required. We'll respond to your inquiry within 24-48 business hours.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#001F5F] hover:bg-[#001845] text-white font-medium text-base"
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
