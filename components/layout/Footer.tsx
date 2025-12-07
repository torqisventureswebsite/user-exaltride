import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#000B5C] text-white">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image src="/images/logo.png" alt="Exaltride Logo" className="invert" width={150} height={50} />
              <p className="text-[10px] md:text-xs text-gray-300 tracking-widest">YOUR RIDE. REINVENTED.</p>
            </div>
          </div>
          {/* Quicklinks */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-sm md:text-base mb-4 border-b border-yellow-400 pb-2 inline-block">
              Quicklinks
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-200 hover:text-yellow-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-200 hover:text-yellow-400 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/products?type=deals" className="text-gray-200 hover:text-yellow-400 transition-colors text-sm">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-200 hover:text-yellow-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policy */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-sm md:text-base mb-4 border-b border-yellow-400 pb-2 inline-block">
              Help & Policy
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#faq" className="text-gray-200 hover:text-yellow-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#shipping" className="text-gray-200 hover:text-yellow-400 transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#return" className="text-gray-200 hover:text-yellow-400 transition-colors text-sm">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-gray-200 hover:text-yellow-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-gray-200 hover:text-yellow-400 transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-sm md:text-base mb-4 border-b border-yellow-400 pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@autoessentials.com"
                  className="text-gray-200 hover:text-yellow-400 transition-colors text-sm block"
                >
                  support@autoessentials.com
                </a>
              </li>
              <li>
                <a
                  href="tel:1800-123-4567"
                  className="text-gray-200 hover:text-yellow-400 transition-colors text-sm block"
                >
                  1800-123-4567
                </a>
              </li>
              <li className="text-gray-200 text-sm leading-relaxed pt-2">
                502, 5th Floor, Skyline Plaza,<br />
                MG Road, Bengaluru 560001, India
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8 border-t border-white/20">
          {/* Newsletter Text and Input */}
          <div className="flex-1 w-full">
            <p className="text-gray-200 text-sm mb-3">
              Join our mailing list to stay in the loop with us...
            </p>
            <form className="flex max-w-lg">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-l-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-[#000B5C] font-semibold px-6 py-2.5 rounded-r-md transition-colors text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-[#000B5C]" fill="currentColor" />
            </a>
            <a
              href="#"
              className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-[#000B5C]" fill="currentColor" />
            </a>
            <a
              href="#"
              className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-[#000B5C]" fill="currentColor" />
            </a>
            <a
              href="#"
              className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-[#000B5C]" fill="currentColor" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/20">
          <p className="text-gray-300 text-xs">
            © 2025 Auto Essentials. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
