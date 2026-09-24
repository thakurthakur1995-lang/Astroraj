import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Award, 
  MapPin, 
  Calendar 
} from "lucide-react";

export function WhyChooseGuruji() {
  const points = [
    {
      title: "12+ Years Vedic Experience & Lineage",
      description: "Trained under sacred Parashari and Jaimini traditions, receiving Shri Vidya Diksha from Jagatguru Shankaracharya Swaroopananda Saraswati.",
      icon: Award,
    },
    {
      title: "No Fear-Based Predictions",
      description: "We strictly reject superstition and predatory fear marketing. Every astrological reading is grounded in constructive karmic solutions and empowerment.",
      icon: ShieldCheck,
    },
    {
      title: "Compassionate, Personalized 1-on-1 Sessions",
      description: "No generic computer-generated printouts. Guruji personally studies your chart prior to your call and answers your specific life queries directly.",
      icon: Heart,
    },
    {
      title: "Holy Rishikesh Sanctity (Maa Ganga Banks)",
      description: "All Vedic pujas, Siddh yantras, and planetary gemstones are consecrated with authentic Vedic Vidhi right here in Muni Ki Reti, Rishikesh.",
      icon: MapPin,
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Trust Visual & Credential Stack */}
          <div className="lg:col-span-5 relative">
            {/* Outer Golden Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-saffron-500/25 via-gold-500/25 to-amber-500/15 rounded-3xl filter blur-2xl transform rotate-1 scale-105" />

            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden bg-[#160c08] border-2 border-gold-400/50 shadow-2xl group">
              <div className="relative h-[500px] sm:h-[540px] w-full overflow-hidden">
                
                {/* Layer 1: Sacred Rishikesh Ashram Sanctuary on Ganga Banks */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/ashram-sanctuary-bg.jpg"
                    alt="Sacred Rishikesh Ashram on Ganga Banks"
                    fill
                    priority
                    className="object-cover object-center scale-105 filter brightness-[0.92] contrast-[1.06] transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Atmospheric Divine Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160c08] via-[#160c08]/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
                </div>

                {/* Layer 2: Subtle Radiant Golden Dhyana Halo behind Guruji's head */}
                <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 w-56 sm:w-64 h-56 sm:h-64 rounded-full bg-gradient-to-tr from-amber-400/35 via-gold-300/40 to-saffron-500/25 blur-3xl pointer-events-none animate-pulse" />

                {/* Layer 3: Sacred Mandala Halo Ring */}
                <div className="absolute top-12 sm:top-16 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-48 sm:h-56 pointer-events-none opacity-30">
                  <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_80s_linear_infinite]">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="3,3" />
                    <circle cx="100" cy="100" r="75" fill="none" stroke="#fbbf24" strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="#d97706" strokeWidth="0.5" strokeDasharray="2,4" />
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

                {/* Layer 4: Astrologer Rajat Thakur in Deep Meditation (Padmasana) */}
                <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center items-end pointer-events-none">
                  <div className="relative w-[340px] sm:w-[390px] h-[370px] sm:h-[420px]">
                    <Image
                      src="/images/guruji-meditation.png"
                      alt="Astrologer Rajat Thakur in Meditation - Muni Ki Reti Rishikesh"
                      fill
                      priority
                      className="object-contain object-bottom drop-shadow-[0_16px_32px_rgba(0,0,0,0.9)] drop-shadow-[0_0_35px_rgba(245,158,11,0.3)] transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>

                {/* Layer 5: Glassmorphism Information Overlay at Base with Seamless Blend */}
                <div className="absolute bottom-0 inset-x-0 z-20 px-6 pt-20 pb-7 bg-gradient-to-t from-[#140a06] via-[#140a06]/95 via-45% to-transparent text-white space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-saffron-600 to-amber-600 text-[11px] font-bold tracking-wider uppercase shadow-md border border-amber-400/30">
                    <Sparkles className="w-3 h-3 text-gold-200" />
                    <span>Sacred Ashram</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-wide drop-shadow-md">
                    Rooted in Rishikesh
                  </h3>
                  <p className="text-xs text-amber-100/90 leading-relaxed font-normal max-w-[240px] sm:max-w-[270px]">
                    Muni Ki Reti, banks of holy Maa Ganga. Where sacred dhyana meets authentic Vedic astrology.
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping Trust Stat Badge */}
            <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-gold-400/40 z-30 transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center font-serif text-2xl font-bold shadow-inner">
                  ॐ
                </div>
                <div>
                  <div className="text-sm font-bold text-vedic-dark leading-tight">10,000+ Consultations</div>
                  <div className="text-xs text-vedic-muted leading-tight">Across India & 35+ Nations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Why People Choose */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
                <span>The Astro Raj Difference</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
                Why People Choose Guruji
              </h2>
              <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
                In an era crowded with superficial apps and fear-driven horoscopes, Astrologer Rajat Thakur provides a sanctuary of genuine Vedic integrity, ancient lineage, and life-changing clarity.
              </p>
            </div>

            {/* Benefit Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {points.map((pt, idx) => {
                const Icon = pt.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-ivory border border-border space-y-2 hover:border-saffron-500/40 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-saffron-100/70 text-saffron-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-base font-bold text-vedic-dark">
                      {pt.title}
                    </h4>
                    <p className="text-xs text-vedic-muted leading-relaxed">
                      {pt.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/book-consultation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Consultation</span>
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold text-vedic-dark hover:text-saffron-700 underline underline-offset-4 transition-colors"
              >
                Read Guruji&apos;s Full Story & Lineage →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
