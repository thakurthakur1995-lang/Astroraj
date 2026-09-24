"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/constants";

export function MobileStickyBar() {
  const whatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    SITE_SETTINGS.whatsappMessage
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gold-500/20 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Call Guruji */}
        <a
          href={`tel:${SITE_SETTINGS.cleanPhone}`}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-ivory text-vedic-dark border border-border hover:bg-ivory-card transition-colors text-center"
          aria-label="Call Guruji"
        >
          <Phone className="w-4 h-4 text-saffron-600 mb-0.5" />
          <span className="text-[11px] font-semibold leading-tight">Call Guruji</span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors text-center"
          aria-label="WhatsApp Guruji"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[11px] font-semibold leading-tight">WhatsApp</span>
        </a>

        {/* Book Consultation */}
        <Link
          href="/book-consultation"
          className="flex-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs shadow-md transition-all active:scale-98 text-center"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Book Consultation</span>
        </Link>
      </div>
    </div>
  );
}
