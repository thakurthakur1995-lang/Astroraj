import React from "react";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/constants";

export function FinalCta() {
  const whatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    SITE_SETTINGS.whatsappMessage
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-vedic-dark via-vedic-brown to-vedic-dark py-20 text-white">
      {/* Subtle Pattern & Ambient Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4a359_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
        {/* Sacred Sun Emblem */}
        <div className="w-14 h-14 mx-auto rounded-full bg-saffron-600/30 border border-gold-400/40 flex items-center justify-center text-gold-400 font-serif text-2xl font-bold shadow-lg">
          ॐ
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Ready to Find Clarity in Your Life&apos;s Journey?
        </h2>

        <p className="text-base sm:text-lg text-amber-100/80 max-w-2xl mx-auto leading-relaxed">
          Whether you are navigating a career crossroads, relationship uncertainty, or seeking genuine spiritual remedies, Astrologer Rajat Thakur is here to provide sincere, non-fear-based Vedic guidance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/book-consultation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span>Book a Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp Guruji</span>
          </a>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-amber-200/70">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>Audio & Video Call Options</span>
          </span>
          <span>•</span>
          <span>Normal & 24h Urgent Turnaround</span>
          <span>•</span>
          <span>100% Confidential</span>
        </div>
      </div>
    </section>
  );
}
