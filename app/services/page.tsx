import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Compass, Flame, Sparkles, Leaf } from "lucide-react";
import { getServices, getServiceCategories } from "@/lib/supabase/repository";

export const metadata: Metadata = {
  title: "Vedic Services & Sacred Offerings | Astro Raj",
  description:
    "Explore authentic Vedic astrology consultations, Rishikesh online pujas & havans, certified natural gemstones, and traditional Ayurveda wellness guidance.",
};

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    getServiceCategories(),
    getServices(),
  ]);

  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
            <span>Rooted in Shri Vidya & Parashari Tradition</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight">
            Vedic Services & Consultations
          </h1>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            From deep horoscope analysis and Prashna readings to powerful Vedic havans in Rishikesh, explore authentic spiritual solutions crafted for genuine life clarity.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon =
              cat.id === "astrology"
                ? Compass
                : cat.id === "puja"
                ? Flame
                : cat.id === "gemstones"
                ? Sparkles
                : Leaf;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-6 border border-border shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-vedic-dark">
                    {cat.title}
                  </h2>
                  <p className="text-xs text-vedic-muted leading-relaxed">
                    {cat.shortDescription}
                  </p>
                </div>

                <Link
                  href={`/services/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 hover:text-saffron-800 transition-colors pt-3 border-t border-border"
                >
                  <span>Explore Offerings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* All Services Detailed List */}
        <div className="space-y-8 pt-8">
          <div className="border-b border-border pb-4">
            <h2 className="font-serif text-2xl font-bold text-vedic-dark">
              All Available Consultations & Havans
            </h2>
            <p className="text-xs sm:text-sm text-vedic-muted">
              Select any service below to view in-depth details, methodology, benefits, and schedule your appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-border overflow-hidden hover:border-saffron-500/50 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-ivory-card">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vedic-dark/70 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 rounded text-xs font-bold text-saffron-700">
                    Starts ₹{service.priceStartingFrom.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 block">
                      {service.categoryId.toUpperCase()}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-vedic-dark group-hover:text-saffron-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-vedic-muted line-clamp-2">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    {service.benefits.slice(0, 2).map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-vedic-dark/85">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border/80 flex items-center justify-between">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-xs font-semibold text-vedic-muted hover:text-vedic-dark"
                    >
                      Learn More
                    </Link>
                    <Link
                      href={`/book-consultation?service=${service.slug}`}
                      className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
