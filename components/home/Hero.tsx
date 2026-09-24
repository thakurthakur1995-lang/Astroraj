"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, ShieldCheck, Video, PhoneCall, Sparkles } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/constants";

export function Hero() {
  const whatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    SITE_SETTINGS.whatsappMessage
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-ivory to-ivory-card pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-border/60">
      {/* Subtle Spiritual Ambient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-saffron-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-gold-200/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition & Conversion */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Spiritual Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-50 border border-saffron-200/80 text-saffron-800 text-xs font-semibold tracking-wide shadow-xs mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-saffron-600 animate-pulse" />
              <span>Authentic Vedic Astrology & Shri Vidya Parampara</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight leading-[1.18]">
              Find Clarity in Your Career, Relationships & Life Through{" "}
              <span className="text-saffron-700 decoration-gold-400 underline decoration-wavy decoration-1 underline-offset-8">
                Vedic Astrology
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-vedic-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Personalized Vedic Astrology, Kundli Analysis, Sacred Pujas & Spiritual Guidance by{" "}
              <strong className="text-vedic-dark font-semibold">Astrologer Rajat Thakur</strong>. Compassionate, non-fear-based insights from the banks of holy Maa Ganga in Rishikesh.
            </p>

            {/* Trust Micro-Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-vedic-dark font-medium max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/80 border border-border">
                <Video className="w-4 h-4 text-saffron-600 shrink-0" />
                <span>Audio & Video Call</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/80 border border-border">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/80 border border-border col-span-2 sm:col-span-1">
                <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
                <span>No Fear Predictions</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/book-consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <Calendar className="w-5 h-5" />
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-ivory text-vedic-dark border border-border font-semibold text-base transition-all duration-200"
              >
                <span>Explore Services</span>
              </Link>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2 text-xs text-vedic-muted flex items-center justify-center lg:justify-start gap-2">
              <span>Have an urgent question?</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
              >
                Chat on WhatsApp (+91 6398-754093)
              </a>
            </div>
          </div>

          {/* Right Column: Astrologer Portrait & Credential Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer Golden Glow Ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-saffron-500/30 via-gold-500/30 to-amber-500/20 rounded-3xl filter blur-2xl transform -rotate-1 scale-105" />

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden bg-[#160c08] border-2 border-gold-400/50 shadow-2xl group">
                <div className="relative h-[500px] sm:h-[540px] w-full overflow-hidden">
                  
                  {/* Layer 1: Sacred Rishikesh Temple & Ganges Sunrise Background */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/images/hero-bg-temple.jpg"
                      alt="Sacred Rishikesh Temple Sunrise"
                      fill
                      priority
                      className="object-cover object-center scale-105 filter brightness-[0.94] contrast-[1.06] transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Atmospheric Divine Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160c08] via-[#160c08]/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />
                  </div>

                  {/* Layer 2: Radiant Golden Aura (Prabha Halo) behind Guruji's head */}
                  <div className="absolute top-12 sm:top-16 left-[54%] -translate-x-1/2 w-64 sm:w-72 h-64 sm:h-72 rounded-full bg-gradient-to-tr from-amber-400/40 via-gold-300/45 to-saffron-500/30 blur-3xl pointer-events-none animate-pulse" />
                  
                  {/* Layer 3: Sacred Mandala Halo Ring */}
                  <div className="absolute top-10 sm:top-14 left-[54%] -translate-x-1/2 w-56 sm:w-64 h-56 sm:h-64 pointer-events-none opacity-40">
                    <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_60s_linear_infinite]">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="3,3" />
                      <circle cx="100" cy="100" r="78" fill="none" stroke="#fbbf24" strokeWidth="0.5" />
                      <circle cx="100" cy="100" r="65" fill="none" stroke="#d97706" strokeWidth="0.5" strokeDasharray="2,4" />
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line
                          key={i}
                          x1="100"
                          y1="10"
                          x2="100"
                          y2="20"
                          stroke="#fbbf24"
                          strokeWidth="1"
                          transform={`rotate(${i * 30} 100 100)`}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Layer 4: Astrologer Rajat Thakur Foreground Cutout - Anchored to Bottom */}
                  <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center items-end pointer-events-none">
                    <div className="relative w-[350px] sm:w-[400px] h-[370px] sm:h-[420px]">
                      <Image
                        src="/images/astrologer-rajat-thakur.png"
                        alt="Astrologer Rajat Thakur - Shri Vidya Sadhak"
                        fill
                        priority
                        className="object-contain object-bottom drop-shadow-[0_16px_32px_rgba(0,0,0,0.9)] drop-shadow-[0_0_35px_rgba(245,158,11,0.35)] transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>

                  {/* Layer 5: Glassmorphism Information Overlay at Base with Seamless Blend */}
                  <div className="absolute bottom-0 inset-x-0 z-20 px-6 pt-20 pb-8 bg-gradient-to-t from-[#140a06] via-[#140a06]/95 via-50% to-transparent text-white space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-saffron-600 to-amber-600 text-[11px] font-bold tracking-wider uppercase shadow-md border border-amber-400/30">
                      <Sparkles className="w-3 h-3 text-gold-200" />
                      <span>Shri Vidya Sadhak</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white tracking-wide drop-shadow-md">
                      Astrologer Rajat Thakur
                    </h3>
                    <p className="text-xs text-amber-100/90 leading-relaxed font-normal max-w-sm">
                      Initiated by Jagatguru Shankaracharya Swaroopananda Saraswati. Guiding individuals worldwide with authentic Parashari Vedic Astrology.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -top-4 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-gold-400/40 flex items-center gap-3 z-30 transition-transform duration-300 hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-inner">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-vedic-dark">12+ Years</div>
                  <div className="text-[11px] text-vedic-muted">Vedic Experience</div>
                </div>
              </div>

              {/* Floating Location Badge */}
              <div className="absolute -bottom-5 left-6 sm:left-8 bg-white/95 backdrop-blur-md rounded-2xl py-2 px-3.5 shadow-xl border border-gold-400/40 flex items-center gap-2.5 z-30 transition-transform duration-300 hover:scale-105">
                <div className="w-7 h-7 rounded-full bg-saffron-50 text-saffron-600 flex items-center justify-center text-sm font-serif shadow-inner">
                  ॐ
                </div>
                <div>
                  <div className="text-xs font-bold text-vedic-dark leading-tight">Rishikesh Ashram</div>
                  <div className="text-[10px] text-vedic-muted leading-tight">Muni Ki Reti, Uttarakhand</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
