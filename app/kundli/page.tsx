import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Compass, 
  Calendar, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  FileText
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kundli Analysis & Birth Chart Reading | Astrologer Rajat Thakur",
  description:
    "Comprehensive Vedic Kundli analysis by Astrologer Rajat Thakur. Decode your Lagna, Navamsha, Mahadasha cycles, and discover authentic remedies for Manglik and Kaal Sarp doshas.",
};

export default function KundliPage() {
  const chartAreas = [
    {
      title: "Career & Dharma (10th House)",
      description: "Discover your favorable professional vocations, promotion timelines, business inclinations, and the optimal periods for launching initiatives.",
      icon: "🎯",
    },
    {
      title: "Marriage & Partnership (7th House)",
      description: "In-depth Navamsha (D9) and Ashtakoot examination. Identify relationship dynamics, timing of marriage, and remedies for marital friction.",
      icon: "💍",
    },
    {
      title: "Wealth & Dhana Yogas (2nd & 11th Houses)",
      description: "Analyze the planetary wealth circuits in your horoscope. Understand sources of steady financial gain, savings stability, and windfall opportunities.",
      icon: "🪙",
    },
    {
      title: "Health & Vitality (1st & 6th Houses)",
      description: "Astrological assessment of constitutional vitality, biological doshas (Vata, Pitta, Kapha), and preventative planetary lifestyle alignments.",
      icon: "🌿",
    },
  ];

  const doshaRemedies = [
    {
      name: "Manglik Dosha (Kuja Dosha)",
      insight: "In over 60% of horoscopes, Kuja Dosha is cancelled by Mars' own sign or Jupiter's aspect. Guruji checks exact Bhanga yogas without unnecessary panic.",
    },
    {
      name: "Kaal Sarp Dosha",
      insight: "When all planets are hemmed between Rahu and Ketu. Prescribes peaceful Shiva rituals and Trimbakeshwar/Rishikesh Havans to release trapped potential.",
    },
    {
      name: "Shani Sade Sati & Dhaiya",
      insight: "The 7.5-year transit of Saturn. Rather than fearing Shani Dev, learn how this karmic cycle refines discipline, resilience, and monumental lasting growth.",
    },
    {
      name: "Pitra Dosha & Karmic Debt",
      insight: "Gentle Vedic tarpana, Gau-seva, and righteous ancestral charity to dissolve ancestral karmic blockages and restore family peace.",
    },
  ];

  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Sacred Janma Kundli Decode</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight leading-tight">
                Vedic Kundli Analysis & Life Blueprint
              </h1>
              <p className="text-base text-vedic-muted leading-relaxed">
                Your Janma Kundli is the cosmic celestial screenshot of the heavens at the exact second you took your first breath. In the Parashari and Jaimini traditions, Astrologer Rajat Thakur deciphers your karmic strengths, challenges, and timeline opportunities with compassion and exactitude.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/book-consultation?service=kundli-analysis"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Kundli Analysis Session</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-ivory hover:bg-ivory-card text-vedic-dark border border-border font-semibold text-sm transition-all"
                >
                  <span>Ask a Quick Question</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xl border border-border bg-vedic-dark">
                <Image
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                  alt="Vedic Kundli Cosmic Chart"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vedic-dark via-vedic-dark/40 to-transparent" />
                <div className="absolute bottom-6 inset-x-6 text-white text-center space-y-1">
                  <div className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                    Parashara & Jaimini Jyotish
                  </div>
                  <div className="font-serif text-xl font-bold">
                    Divisional Chart Scrutiny (D1, D9, D10)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Chart Analysis */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl font-bold text-vedic-dark">
              What Your Kundli Reveals
            </h2>
            <p className="text-xs sm:text-sm text-vedic-muted">
              Every house and planetary placement governs a distinct dimension of human experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chartAreas.map((area, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-border shadow-xs hover:shadow-lg transition-all space-y-3"
              >
                <div className="text-3xl">{area.icon}</div>
                <h3 className="font-serif text-base font-bold text-vedic-dark">
                  {area.title}
                </h3>
                <p className="text-xs text-vedic-muted leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Demystifying Doshas Section */}
        <div className="bg-white rounded-3xl border border-border p-8 sm:p-10 shadow-xs space-y-8">
          <div className="border-b border-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 block mb-1">
              Ethical Vedic Perspective
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark">
              Demystifying Common Planetary Doshas
            </h2>
            <p className="text-xs sm:text-sm text-vedic-muted max-w-2xl mt-1">
              Astrologer Rajat Thakur rejects commercial fear tactics. Here is how ancient texts actually approach planetary afflictions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doshaRemedies.map((dosha, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-ivory border border-border space-y-2 hover:border-gold-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-600" />
                  <h3 className="font-serif text-base font-bold text-vedic-dark">
                    {dosha.name}
                  </h3>
                </div>
                <p className="text-xs text-vedic-muted leading-relaxed">
                  {dosha.insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Required Details Checklist */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-vedic-dark">
              What You Need to Begin Your Kundli Reading:
            </h3>
            <p className="text-xs text-vedic-muted">
              1) Exact Date of Birth, 2) Accurate Time of Birth (AM/PM), and 3) City / Country of Birth.
            </p>
          </div>

          <Link
            href="/book-consultation?service=kundli-analysis"
            className="px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs shadow-md shrink-0"
          >
            Schedule Kundli Reading Now
          </Link>
        </div>
      </div>
    </div>
  );
}
