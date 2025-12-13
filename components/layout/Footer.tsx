import Link from "next/link";
import {
  Facebook,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#000B5C] to-[#000842] text-white">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image src="/images/logo.png" alt="Exaltride Logo" width={120} height={40} />
              <p className="text-[10px] md:text-xs text-gray-400 tracking-widest mt-1">YOUR RIDE. REINVENTED.</p>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mt-4">
              ExaltRide — your car&apos;s online upgrade hub. Everything you need, all in one place.
            </p>
          </div>

          {/* Quicklinks - with border box */}
          <div className="border border-white/20 bg-white/5 rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-yellow-400 font-semibold text-sm md:text-base mb-4">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              Quicklinks
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/products?type=deals" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policy - with border box */}
          <div className="border border-white/20 bg-white/5  rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-yellow-400 font-semibold text-sm md:text-base mb-4">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              Help & Policy
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href={"/policies/shipping" as any} className="text-gray-300 hover:text-white transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href={"/policies/returns" as any} className="text-gray-300 hover:text-white transition-colors text-sm">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href={"/policies/privacy" as any} className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={"/policies/terms" as any} className="text-gray-300 hover:text-white transition-colors text-sm">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us - with border box */}
          <div className="border border-white/20 bg-white/5 rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-yellow-400 font-semibold text-sm md:text-base mb-4">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@autoessentials.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 text-gray-400" />
                  support@autoessentials.com
                </a>
              </li>
              <li>
                <a
                  href="tel:1800-123-4567"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 text-gray-400" />
                  1800-123-4567
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>
                  502, 5th Floor, Skyline Plaza,<br />
                  MG Road, Bengaluru 560001, India
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-white/10">
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © 2025 Exaltride. All Rights Reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="https://www.facebook.com/people/exaltride/61583843222896/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-[#1a2a7a] hover:bg-[#2a3a8a] rounded-full transition-colors flex-shrink-0"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a
              href="https://www.linkedin.com/showcase/exalt-ride/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-[#1a2a7a] hover:bg-[#2a3a8a] rounded-full transition-colors flex-shrink-0"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-white" />
            </a>
            <a
              href="https://www.instagram.com/exaltride/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-[#1a2a7a] hover:bg-[#2a3a8a] rounded-full transition-colors flex-shrink-0"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
