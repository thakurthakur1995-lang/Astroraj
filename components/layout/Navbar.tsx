"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  MessageCircle,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  Calendar,
  MapPin,
  Sparkles,
  Compass,
  Flame,
  Leaf
} from "lucide-react";
import { SITE_SETTINGS, NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  const whatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    SITE_SETTINGS.whatsappMessage
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner Bar - Desktop */}
      <div className="hidden lg:block bg-vedic-dark text-amber-100/90 text-xs py-2 px-6 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-gold-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Ashram: Rishikesh, Uttarakhand (Banks of Maa Ganga)</span>
            </span>
            <span className="text-amber-200/50">•</span>
            <span className="text-amber-100/80">
              Shri Vidya Diksha from Jagatguru Shankaracharya Swaroopananda Saraswati
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${SITE_SETTINGS.cleanPhone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-saffron-400" />
              <span>{SITE_SETTINGS.phone}</span>
            </a>
            <span className="text-amber-200/50">•</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Guruji</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-border"
            : "bg-white/90 backdrop-blur-xs py-4 border-b border-border/60"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-500 via-saffron-600 to-vedic-brown flex items-center justify-center text-white shadow-md ring-2 ring-gold-400/30 group-hover:scale-105 transition-transform">
              <span className="font-serif text-lg font-bold">ॐ</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-vedic-dark leading-none">
                ASTRO RAJ
              </span>
              <span className="text-[11px] font-medium tracking-wider uppercase text-saffron-700 mt-0.5">
                Astrologer Rajat Thakur
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => {
              if (link.submenu) {
                return (
                  <div
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${pathname.startsWith(link.href)
                          ? "text-saffron-700 bg-saffron-50/80 font-semibold"
                          : "text-vedic-dark hover:text-saffron-700 hover:bg-ivory"
                        }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                    </Link>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute top-full left-0 w-80 pt-2 transition-all duration-200 ${servicesDropdownOpen
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2 pointer-events-none"
                        }`}
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-border/80 p-2 space-y-1">
                        {link.submenu.map((subItem) => {
                          const IconComponent =
                            subItem.href.includes("astrology")
                              ? Compass
                              : subItem.href.includes("puja")
                                ? Flame
                                : subItem.href.includes("gemstones")
                                  ? Sparkles
                                  : Leaf;

                          return (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-ivory transition-colors group/item"
                            >
                              <div className="w-8 h-8 rounded-md bg-saffron-50 text-saffron-700 flex items-center justify-center shrink-0 group-hover/item:bg-saffron-600 group-hover/item:text-white transition-colors">
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-vedic-dark group-hover/item:text-saffron-700 transition-colors">
                                  {subItem.label}
                                </div>
                                <div className="text-xs text-vedic-muted line-clamp-1">
                                  {subItem.description}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "text-saffron-700 bg-saffron-50 font-semibold"
                      : "text-vedic-dark hover:text-saffron-700 hover:bg-ivory"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg text-vedic-dark hover:bg-ivory transition-colors"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-vedic-brown" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-saffron-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Book Consultation Button (Desktop) */}
            <Link
              href="/book-consultation"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Consultation</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-vedic-dark hover:bg-ivory transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => {
                if (link.submenu) {
                  return (
                    <div key={link.label} className="space-y-1 py-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-saffron-700 px-3 pt-2">
                        {link.label}
                      </div>
                      <div className="pl-2 space-y-1">
                        {link.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-3 py-2 rounded-md text-sm font-medium text-vedic-dark hover:bg-ivory"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-vedic-dark hover:bg-ivory"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Contact Quick Actions */}
            <div className="pt-3 border-t border-border space-y-2">
              <a
                href={`tel:${SITE_SETTINGS.cleanPhone}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ivory text-vedic-dark text-sm font-medium"
              >
                <Phone className="w-4 h-4 text-saffron-600" />
                <span>Call Guruji: {SITE_SETTINGS.phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp: +91 6398-754093</span>
              </a>
              <Link
                href="/book-consultation"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-saffron-600 text-white font-semibold text-sm shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
