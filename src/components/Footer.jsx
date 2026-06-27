"use client";
import Link from "next/link";
import {
  FacebookLogoIcon,
  XLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-4xl font-bold tracking-tight text-gray-900 mb-3 block"
            >
              Refl<span className="text-indigo-500">ct</span>
            </Link>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Preserving wisdom, sharing growth, and building a community of
              mindful learners.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/public-lessons"
                  className="hover:text-primary transition-colors"
                >
                  Public Lessons
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-lg">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-lg">
              Connect With Us
            </h3>
            <div className="flex gap-4 text-2xl mb-6">
              <Link href="#" className="hover:text-blue-400 transition-colors">
                <FacebookLogoIcon />
              </Link>
              <Link href="#" className="hover:text-black transition-colors">
                <XLogoIcon />
              </Link>
              <Link href="#" className="hover:text-pink-500 transition-colors">
                <InstagramLogoIcon />
              </Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">
                <LinkedinLogoIcon />
              </Link>
            </div>

            <div className="text-sm space-y-1">
              <p>
                Made with ❤️ for lifelong learners. Designed to inspire growth
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        Copyright 2026 &copy;{" "}
        <Link href={"https://shahsaminyasar.vercel.app"} target="_blank">
          Shah Samin Yasar
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
