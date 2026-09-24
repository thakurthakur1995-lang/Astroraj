"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Phone, Video, Zap, Clock, ShieldCheck, ArrowRight } from "lucide-react";

export function PricingSection() {
  const [selectedMode, setSelectedMode] = useState<"all" | "audio" | "video">("all");

  const packages = [
    {
      id: "audio-15",
      mode: "audio",
      title: "15 Min Audio Consultation",
      tagline: "Quick, specific single-question clarity",
      idealFor: "Immediate decisions, single career or relationship query",
      normalPrice: 2100,
      normalTurnaround: "7–15 Days",
      urgentPrice: 4200,
      urgentTurnaround: "Within 24 Hours",
      features: [
        "1-on-1 private phone call with Guruji",
        "Direct question & answer round",
        "Vedic remedy recommendations",
        "Follow-up remedy note via WhatsApp",
      ],
      popular: false,
    },
    {
      id: "audio-30",
      mode: "audio",
      title: "30 Min Audio Consultation",
      tagline: "Comprehensive chart and dasha scrutiny",
      idealFor: "Deep career, marriage compatibility, and business roadmap",
      normalPrice: 3100,
      normalTurnaround: "7–15 Days",
      urgentPrice: 6200,
      urgentTurnaround: "Within 24 Hours",
      features: [
        "Full Janma Kundli & Navamsha analysis",
        "Examination of current Mahadasha/Antardasha",
        "Detailed discussion of life opportunities & obstacles",
        "Vedic remedies & gemstone advice if applicable",
      ],
      popular: true,
    },
    {
      id: "video-15",
      mode: "video",
      title: "15 Min Video Consultation",
      tagline: "Face-to-face personalized consultation",
      idealFor: "Visual chart explanation on high-definition video call",
      normalPrice: 3100,
      normalTurnaround: "7–15 Days",
      urgentPrice: 6200,
      urgentTurnaround: "Within 24 Hours",
      features: [
        "Face-to-face HD private video conference",
        "Visual inspection of planetary chart diagrams",
        "Direct interaction with Guruji",
        "Written remedies sent post-session",
      ],
      popular: false,
    },
    {
      id: "video-30",
      mode: "video",
      title: "30 Min Video Consultation",
      tagline: "Most thorough face-to-face deep dive",
      idealFor: "Couples, family charts, complex life transformations",
      normalPrice: 5100,
      normalTurnaround: "7–15 Days",
      urgentPrice: 10200,
      urgentTurnaround: "Within 24 Hours",
      features: [
        "Complete deep-dive video session with Guruji",
        "Analysis of divisional charts (D9 Navamsha, D10 Dashamsha)",
        "Both partners chart analysis for marriage if required",
        "Customized Vedic remedies, mantras, and gemstones",
      ],
      popular: true,
    },
  ];

  const filtered =
    selectedMode === "all"
      ? packages
      : packages.filter((p) => p.mode === selectedMode);

  return (
    <section className="py-20 bg-white border-y border-border/80" id="pricing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
            <span>Honest & Transparent</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
            Consultation Plans & Pricing
          </h2>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            Transparent pricing with zero hidden charges. Choose normal scheduling (7-15 days) or urgent turnaround (within 24 hours).
          </p>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-ivory rounded-xl border border-border mt-4">
            <button
              onClick={() => setSelectedMode("all")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedMode === "all"
                  ? "bg-white text-vedic-dark shadow-xs"
                  : "text-vedic-muted hover:text-vedic-dark"
              }`}
            >
              All Plans
            </button>
            <button
              onClick={() => setSelectedMode("audio")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedMode === "audio"
                  ? "bg-white text-vedic-dark shadow-xs"
                  : "text-vedic-muted hover:text-vedic-dark"
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-saffron-600" />
              <span>Audio Call</span>
            </button>
            <button
              onClick={() => setSelectedMode("video")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedMode === "video"
                  ? "bg-white text-vedic-dark shadow-xs"
                  : "text-vedic-muted hover:text-vedic-dark"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-saffron-600" />
              <span>Video Call</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 relative ${
                pkg.popular
                  ? "bg-ivory border-saffron-500 shadow-md ring-1 ring-saffron-500/20"
                  : "bg-white border-border hover:shadow-lg hover:border-gold-400"
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-saffron-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Most Recommended
                </div>
              )}

              {/* Title & Mode */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center">
                    {pkg.mode === "audio" ? <Phone className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-0.5 rounded">
                    {pkg.mode.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-vedic-dark">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-vedic-muted mt-1">
                    {pkg.tagline}
                  </p>
                </div>

                {/* Pricing Box (Normal vs Urgent) */}
                <div className="p-3 bg-white rounded-xl border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-vedic-muted block">Normal (7–15 Days)</span>
                      <span className="font-serif text-xl font-bold text-vedic-dark">
                        ₹{pkg.normalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-border/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-saffron-800 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-saffron-600" />
                        Urgent (Within 24h)
                      </span>
                      <span className="font-serif text-base font-bold text-saffron-700">
                        ₹{pkg.urgentPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-vedic-dark block">Includes:</span>
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-vedic-dark/85">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-border/80">
                <Link
                  href={`/book-consultation?plan=${pkg.id}`}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs transition-all shadow-xs ${
                    pkg.popular
                      ? "bg-saffron-600 hover:bg-saffron-700 text-white"
                      : "bg-vedic-dark hover:bg-vedic-brown text-white"
                  }`}
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-12 text-center text-xs text-vedic-muted flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Complete privacy guaranteed. No third-party sharing of birth data or consultation recordings.</span>
        </div>
      </div>
    </section>
  );
}
