import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, Flame, Sparkles, Leaf, ArrowRight } from "lucide-react";

export function FourPillars() {
  const pillars = [
    {
      id: "astrology",
      title: "Astrology Consultation",
      tagline: "Career • Marriage • Kundli • Life Path",
      description: "Direct 1-on-1 audio or video consultation with Guruji. Thorough examination of Janma Kundli, Navamsha, and current Mahadasha for practical clarity.",
      icon: Compass,
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
      link: "/services/astrology-consultation",
      cta: "Learn More",
      badge: "Most Consulted",
    },
    {
      id: "puja",
      title: "Puja & Spiritual Services",
      tagline: "Shri Vidya • Baglamukhi • Vastu • Havans",
      description: "Traditional Vedic havans and rituals conducted on the banks of Maa Ganga in Rishikesh with personalized Sankalp on your family gotra.",
      icon: Flame,
      image: "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80",
      link: "/services/online-puja",
      cta: "Learn More",
      badge: "Rishikesh Vidhi",
    },
    {
      id: "gemstones",
      title: "Certified Vedic Gemstones",
      tagline: "Planetary Recommendation & Energization",
      description: "100% natural, unheated, laboratory-tested gemstones prescribed strictly according to your Lagna and Yogakaraka planetary rulers.",
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80",
      link: "/services/gemstones",
      cta: "Explore Gemstones",
      badge: "Govt Lab Certified",
    },
    {
      id: "ayurveda",
      title: "Ayurveda & Traditional Wellness",
      tagline: "Dosha Balance • Classical Herbal Formulations",
      description: "Integrate ancient Vedic health wisdom, Dinacharya, and classical Dhanvantari herbal formulations to revitalize bodily vitality and calm the mind.",
      icon: Leaf,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      link: "/services/ayurveda",
      cta: "Learn More",
      badge: "Holistic Health",
    },
  ];

  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
            <span>Sacred Offerings</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
            What Are You Looking For?
          </h2>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            Choose from our four core spiritual pillars designed to bring authentic Vedic wisdom, sacred remedies, and harmonious wellness into your life.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="group relative bg-white rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Top */}
                <div className="relative h-48 w-full overflow-hidden bg-ivory-card">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vedic-dark/80 via-vedic-dark/20 to-transparent" />
                  
                  {/* Badge */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-vedic-dark shadow-xs">
                    {pillar.badge}
                  </span>

                  {/* Icon Floating */}
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-saffron-600 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-vedic-dark group-hover:text-saffron-700 transition-colors">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-semibold text-gold-600 tracking-wide">
                      {pillar.tagline}
                    </div>
                    <p className="text-xs text-vedic-muted leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <Link
                    href={pillar.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 hover:text-saffron-800 transition-colors pt-2 border-t border-border/60"
                  >
                    <span>{pillar.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
