import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#001155] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section - Logo and Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10 border-b border-white/10">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">exaltride</h2>
              <p className="text-xs text-gray-300 mt-1">YOUR RIDE. REINVENTED.</p>
            </div>
          </div>

          {/* Quicklinks */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-4">Quicklinks</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/products?type=deals" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policy */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-4">Help & Policy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#faq" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#shipping" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#return" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@autoessentials.com"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm underline"
                >
                  support@autoessentials.com
                </a>
              </li>
              <li>
                <a
                  href="tel:1800-123-4567"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm underline"
                >
                  1800-123-4567
                </a>
              </li>
              <li>
                <p className="text-gray-300 text-sm leading-relaxed">
                  502, 5th Floor, Skyline Plaza,<br />
                  MG Road, Bengaluru 560001, India
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Newsletter Text and Input */}
          <div className="flex-1 w-full lg:w-auto">
            <p className="text-gray-300 text-sm mb-4">
              Join our mailing list to stay in the loop with us...
            </p>
            <form className="flex max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-l-full bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2.5 rounded-r-full transition-colors text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="bg-yellow-400 hover:bg-yellow-500 p-2.5 rounded-lg transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-[#001155]" />
            </a>
            <a
              href="#"
              className="bg-yellow-400 hover:bg-yellow-500 p-2.5 rounded-lg transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-[#001155]" />
            </a>
            <a
              href="#"
              className="bg-yellow-400 hover:bg-yellow-500 p-2.5 rounded-lg transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-[#001155]" />
            </a>
            <a
              href="#"
              className="bg-yellow-400 hover:bg-yellow-500 p-2.5 rounded-lg transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-[#001155]" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-gray-400 text-xs text-center">
            © 2025 Auto Essentials. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
