import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/constants";

export function Footer() {
  const whatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    SITE_SETTINGS.whatsappMessage
  )}`;

  return (
    <footer className="bg-vedic-dark text-amber-100/90 pt-16 pb-12 border-t-2 border-gold-500/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gold-500/20">
          {/* Column 1 & 2: Brand & Ashram Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-saffron-500 via-saffron-600 to-vedic-brown flex items-center justify-center text-white shadow-lg ring-2 ring-gold-400/40">
                <span className="font-serif text-xl font-bold">ॐ</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  ASTRO RAJ
                </span>
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                  Astrologer Rajat Thakur
                </span>
              </div>
            </div>

            <p className="text-sm text-amber-100/75 leading-relaxed pr-4">
              Authentic Vedic Astrology, Kundli Analysis, Sacred Online Pujas, and Certified Gemstones rooted in traditional Shri Vidya Upasana. Preserving ancient spiritual science with transparent, compassionate, and non-fear-based guidance.
            </p>

            <div className="space-y-2 pt-2 text-xs text-amber-200/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  {SITE_SETTINGS.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Shri Vidya Diksha from Jagatguru Shankaracharya Swaroopananda Saraswati</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-gold-500/30 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-amber-100/80">
              <li>
                <Link href="/" className="hover:text-gold-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  About Astrologer Rajat Thakur
                </Link>
              </li>
              <li>
                <Link href="/kundli" className="hover:text-gold-400 transition-colors">
                  Kundli & Birth Chart Analysis
                </Link>
              </li>
              <li>
                <Link href="/book-consultation" className="hover:text-gold-400 transition-colors">
                  Book Live Consultation
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold-400 transition-colors">
                  Consecrated Gemstones & Shop
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gold-400 transition-colors">
                  Vedic Insights & Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  Contact & Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Vedic Services */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-gold-500/30 pb-2">
              Vedic Services
            </h4>
            <ul className="space-y-2 text-sm text-amber-100/80">
              <li>
                <Link href="/services/astrology-consultation" className="hover:text-gold-400 transition-colors">
                  Personal Astrology Consultation
                </Link>
              </li>
              <li>
                <Link href="/services/online-puja" className="hover:text-gold-400 transition-colors">
                  Shri Chakra Sahasran Pooja
                </Link>
              </li>
              <li>
                <Link href="/services/online-puja" className="hover:text-gold-400 transition-colors">
                  Maa Baglamukhi Brahmastra Pooja
                </Link>
              </li>
              <li>
                <Link href="/services/online-puja" className="hover:text-gold-400 transition-colors">
                  Sudarshan Chakra Promotion Havan
                </Link>
              </li>
              <li>
                <Link href="/services/gemstones" className="hover:text-gold-400 transition-colors">
                  Planetary Gemstone Recommendation
                </Link>
              </li>
              <li>
                <Link href="/services/ayurveda" className="hover:text-gold-400 transition-colors">
                  Traditional Ayurveda Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Direct Connect & Timing */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-gold-500/30 pb-2">
              Direct Connect
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${SITE_SETTINGS.cleanPhone}`}
                className="flex items-center gap-2.5 text-amber-100/90 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-saffron-600/30 flex items-center justify-center text-saffron-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{SITE_SETTINGS.phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>WhatsApp Consultation</span>
              </a>

              <a
                href={`mailto:${SITE_SETTINGS.email}`}
                className="flex items-center gap-2.5 text-amber-100/90 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gold-600/30 flex items-center justify-center text-gold-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{SITE_SETTINGS.email}</span>
              </a>
            </div>

            <div className="pt-2 text-xs text-amber-200/70 border-t border-gold-500/20">
              <p className="font-medium text-gold-400">Consultation Timings:</p>
              <p>{SITE_SETTINGS.officeHours}</p>
            </div>
          </div>
        </div>

        {/* Ethical Astrology & Legal Disclaimer */}
        <div className="py-6 border-b border-gold-500/20 text-xs text-amber-200/60 space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 text-gold-400 font-semibold uppercase tracking-wider text-[11px]">
            <HeartHandshake className="w-4 h-4" />
            <span>Ethical Astrology & Guidance Commitment</span>
          </div>
          <p>
            Astrology and Vedic rituals provide spiritual perspectives, self-awareness, and time-honored traditional remedies. They are not intended as substitutes for qualified medical diagnosis, psychological counseling, or licensed financial/legal advisory services. Astrologer Rajat Thakur strictly upholds authentic Vedic methodologies and rejects fear-based predictions or guaranteed instant miracles.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Legal Policies */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-200/70">
          <p>
            © {new Date().getFullYear()} Astro Raj (Astrologer Rajat Thakur). All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy-policy" className="hover:text-gold-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-gold-400 transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-gold-400 transition-colors">
              Refund & Cancellation
            </Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-gold-400 transition-colors">
              Disclaimer
            </Link>
            <span>•</span>
            <Link href="/admin" className="text-amber-300/40 hover:text-amber-200 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
