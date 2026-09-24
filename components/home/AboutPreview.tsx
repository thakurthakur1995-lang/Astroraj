import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Check } from "lucide-react";

export function AboutPreview() {
  const highlights = [
    "Over 12+ years of rigorous Sadhana in Shri Vidya & Parashari Jyotish",
    "Sacred Diksha from Jagatguru Shankaracharya Swaroopananda Saraswati",
    "Specialization in Prashna Kundli, Mahadasha timing & Navamsha analysis",
    "Practicing from Muni Ki Reti, Rishikesh on the banks of holy Ganga",
  ];

  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
                <span>Spiritual Lineage & Background</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
                Meet Astrologer Rajat Thakur
              </h2>
              <p className="text-base text-vedic-muted leading-relaxed">
                Dedicated to uncovering the profound mechanics of destiny through the lens of ancient Vedic wisdom and sincere spiritual practice.
              </p>
            </div>

            <div className="space-y-4 text-sm text-vedic-dark/85 leading-relaxed">
              <p>
                Born into a spiritual environment and initiated into the sacred tradition of Shri Vidya Upasana by <strong>Jagatguru Shankaracharya Swaroopananda Saraswati</strong>, Astrologer Rajat Thakur has devoted his life to understanding planetary karmic cycles and human consciousness.
              </p>
              <p>
                To Guruji, your Janma Kundli (horoscope) is not a fatalistic sentence written in stone; it is a divine navigation map. By comprehending the interplay of your operative Mahadashas and planetary transits, you can make informed decisions in career, business, relationships, and spiritual growth.
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-2 pt-2 border-t border-border">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-vedic-dark font-medium">
                  <div className="w-5 h-5 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Read Full Story CTA */}
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-vedic-dark hover:bg-vedic-brown text-white font-semibold text-sm shadow-md transition-all"
              >
                <BookOpen className="w-4 h-4 text-gold-400" />
                <span>Read Full Story & Philosophy</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Portrait */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Subtle Natural Ambient Depth Shadow */}
              <div className="absolute -inset-1.5 bg-gradient-to-b from-gold-500/15 via-transparent to-amber-900/20 rounded-3xl filter blur-xl opacity-70" />

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden bg-[#160c08] border-2 border-gold-400/40 shadow-2xl">
                <div className="relative h-[500px] sm:h-[540px] w-full overflow-hidden">
                  
                  {/* High-Resolution Realistic Portrait in Vedic Study */}
                  <Image
                    src="/images/astrologer-rajat-study-portrait-framed.jpg"
                    alt="Astrologer Rajat Thakur - Vedic Astrology & Spiritual Guidance"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover object-center"
                  />

                  {/* Subtle Gradient only behind Quote at Base - Keeps Image Fully Bright & Clear */}
                  <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#100703]/95 via-[#100703]/60 to-transparent pointer-events-none" />

                  {/* Quote Overlay at Base */}
                  <div className="absolute bottom-0 inset-x-0 z-20 px-6 pt-8 pb-5 text-white text-center space-y-1">
                    <p className="font-serif text-base sm:text-lg font-bold tracking-wide text-white drop-shadow-md leading-snug">
                      &ldquo;Astrology is a guiding torch, not a rigid sentence.&rdquo;
                    </p>
                    <span className="text-xs text-gold-400 block font-semibold uppercase tracking-wider">
                      — Astrologer Rajat Thakur
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Lineage Credential Badge */}
              <div className="absolute -top-3 sm:-top-4 -right-2 sm:-right-5 bg-white/95 backdrop-blur-md rounded-2xl py-2 px-3.5 shadow-xl border border-gold-400/40 flex items-center gap-2.5 z-30 transition-transform duration-300 hover:scale-105">
                <div className="w-8 h-8 rounded-full bg-saffron-50 text-saffron-600 flex items-center justify-center text-sm font-serif shadow-inner">
                  ॐ
                </div>
                <div>
                  <div className="text-xs font-bold text-vedic-dark leading-tight">Shri Vidya Diksha</div>
                  <div className="text-[10px] text-vedic-muted leading-tight">Sacred Lineage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
