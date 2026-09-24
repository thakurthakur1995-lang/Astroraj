import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Award, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  HeartHandshake, 
  Compass 
} from "lucide-react";
import { SITE_SETTINGS } from "@/lib/constants";
import { getTestimonials } from "@/lib/supabase/repository";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export const metadata: Metadata = {
  title: "About Astrologer Rajat Thakur | Founder of Astro Raj",
  description:
    "Learn about the spiritual journey, Shri Vidya Diksha under Jagatguru Shankaracharya Swaroopananda Saraswati, and 12+ years of Vedic Jyotish practice of Astrologer Rajat Thakur in Rishikesh.",
};

export default async function AboutPage() {
  const testimonials = await getTestimonials();

  const corePillars = [
    {
      title: "Sacred Guru Parampara",
      description: "Blessed with Shri Vidya Diksha from Jagatguru Shankaracharya Swaroopananda Saraswati, following the unadulterated Advaita and Vedic traditions.",
      icon: Award,
    },
    {
      title: "Parashara & Jaimini Foundations",
      description: "Rooted in classical Brihat Parashara Hora Shastra, Jaimini Upadesha Sutras, and Prashna Marga. Combining mathematical accuracy with intuitive insight.",
      icon: Compass,
    },
    {
      title: "Rejection of Fear & False Guarantees",
      description: "True astrology is an awakening of conscience, not an instrument for inducing anxiety or selling superstitious fear.",
      icon: ShieldCheck,
    },
    {
      title: "Rishikesh Sanctity",
      description: "Practicing on the banks of Maa Ganga at Muni Ki Reti, Rishikesh—where spiritual vibration enhances meditative precision in horoscope readings.",
      icon: MapPin,
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
                <span>Spiritual Lineage & Sadhana</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight leading-tight">
                About Astrologer Rajat Thakur
              </h1>
              <p className="text-base sm:text-lg text-vedic-muted leading-relaxed">
                Spiritual mentor, Vedic astrologer, and initiated Shri Vidya practitioner dedicated to guiding individuals through life&apos;s karmic cycles with wisdom, dignity, and truth.
              </p>

              <div className="space-y-3 text-sm text-vedic-dark/85 leading-relaxed">
                <p>
                  From an early age in Uttarakhand, Guruji was drawn to the eternal rhythms of the cosmos and the sacred geometry of the Tantras. He pursued rigorous classical study under traditional pandits and was formally initiated into the exalted path of Shri Vidya Upasana by <strong>Jagatguru Shankaracharya Swaroopananda Saraswati</strong>.
                </p>
                <p>
                  Over the past 12+ years, Guruji has personally analyzed over 200,000 Janma Kundlis and counseled more than 10,000 seekers from India, the United States, Europe, Australia, and the Middle East.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/book-consultation"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation With Guruji</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-ivory hover:bg-ivory-card text-vedic-dark border border-border font-semibold text-sm transition-all"
                >
                  <span>Ashram Directions</span>
                </Link>
              </div>
            </div>

            {/* Astrologer Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md h-[460px] rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-400/40 bg-vedic-dark">
                <Image
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
                  alt="Astrologer Rajat Thakur in Rishikesh"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vedic-dark via-vedic-dark/20 to-transparent" />
                <div className="absolute bottom-6 inset-x-6 text-white text-center space-y-1">
                  <span className="font-serif text-xl font-bold block">
                    Astrologer Rajat Thakur
                  </span>
                  <span className="text-xs text-gold-400 font-sans">
                    Shri Vidya Sadhak • Muni Ki Reti, Rishikesh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Philosophy */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl font-bold text-vedic-dark">
              Core Principles & Philosophy
            </h2>
            <p className="text-xs sm:text-sm text-vedic-muted">
              What sets Astro Raj apart in an era of superficial and fear-based predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {corePillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-border shadow-xs hover:shadow-lg transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-vedic-dark">
                    {item.title}
                  </h3>
                  <p className="text-xs text-vedic-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Story / Approach to Consultations */}
        <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 shadow-xs space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark">
            How Guruji Approaches Each Consultation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-vedic-dark/85 leading-relaxed">
            <div className="p-5 rounded-2xl bg-ivory border border-border space-y-2">
              <span className="font-serif font-bold text-base text-saffron-700 block">
                1. Prior Chart Preparation
              </span>
              <p className="text-vedic-muted">
                Before your session begins, Guruji spends time studying your Janma Kundli, Navamsha (D9), Dashamsha (D10), and current operative Mahadasha to formulate specific insights without rushing.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-ivory border border-border space-y-2">
              <span className="font-serif font-bold text-base text-saffron-700 block">
                2. Empathetic Listening
              </span>
              <p className="text-vedic-muted">
                You are encouraged to speak openly in a confidential environment. No judgment is passed on personal, emotional, or financial dilemmas.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-ivory border border-border space-y-2">
              <span className="font-serif font-bold text-base text-saffron-700 block">
                3. Sattvic Practical Remedies
              </span>
              <p className="text-vedic-muted">
                Remedies emphasize daily mantras, mindful action, charitable acts, fasting when appropriate, and only certified gemstones if the planet is a true functional benefic.
              </p>
            </div>
          </div>
        </div>

        {/* Client Testimonials Section */}
        <TestimonialsSection testimonials={testimonials} />
      </div>
    </div>
  );
}
