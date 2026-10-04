import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Check, 
  Compass, 
  Home, 
  Flame, 
  Sparkles, 
  Leaf, 
  Globe, 
  Building, 
  MessageCircle,
  Calendar
} from "lucide-react";
import { getServices, getServiceCategories } from "@/lib/supabase/repository";

export const metadata: Metadata = {
  title: "Vedic Services & Consultations | Astro Raj",
  description:
    "Explore authentic Vedic astrology consultations, Vastu Shastra audits, Rishikesh online pujas & havans, sacred Mantra Diksha, and traditional Ayurveda wellness guidance.",
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
            Vedic Services & Sacred Offerings
          </h1>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            From deep horoscope analysis and non-demolition Vastu Shastra to powerful Rishikesh havans and sacred Mantra Diksha, explore authentic spiritual solutions available both online and offline in-person.
          </p>
        </div>

        {/* Dual Mode Explainer Banner */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="p-5 rounded-2xl bg-saffron-50/50 border border-saffron-200/60 space-y-2.5">
              <div className="flex items-center gap-2 text-saffron-800 font-bold text-sm">
                <Globe className="w-4 h-4 text-saffron-600" />
                <span>🌐 Online Consultations</span>
              </div>
              <p className="text-xs text-vedic-muted leading-relaxed">
                Connect directly with Astrologer Rajat Thakur from anywhere via 1-on-1 private Audio or HD Video call. Online pujas are performed live in Rishikesh with personalized Sankalp. Instant calendar booking with Razorpay checkout.
              </p>
              <Link
                href="/book-consultation?mode=online"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 hover:text-saffron-800 pt-1"
              >
                <span>Book Online Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Building className="w-4 h-4 text-amber-700" />
                <span>🏛️ Offline Consultations & Site Visits</span>
              </div>
              <p className="text-xs text-vedic-muted leading-relaxed">
                Prefer an in-person meeting? Visit Guruji at our Rishikesh Ashram (Shisham Jhari) or request an on-site property visit for Vastu. Submit your details to admin WhatsApp; our team manually processes payment (UPI/Bank) and confirms your slot.
              </p>
              <Link
                href="/book-consultation?mode=offline"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 pt-1"
              >
                <span>Book Offline (WhatsApp & Manual Pay)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Grid (6 Cards) */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="font-serif text-2xl font-bold text-vedic-dark">
              Core Spiritual Offerings
            </h2>
            <p className="text-xs text-vedic-muted">
              Select a domain below to explore specialized rituals, consultations, and offline booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon =
                cat.id === "astrology"
                  ? Compass
                  : cat.id === "vastu"
                  ? Home
                  : cat.id === "puja"
                  ? Flame
                  : cat.id === "mantra-diksha"
                  ? Sparkles
                  : cat.id === "ayurveda"
                  ? Leaf
                  : Sparkles;

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl p-6 border border-border shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center group-hover:bg-saffron-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 bg-saffron-50 px-2.5 py-1 rounded-md">
                        {cat.badge || "Vedic Offering"}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-vedic-dark group-hover:text-saffron-700 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-vedic-muted leading-relaxed line-clamp-3">
                      {cat.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <Link
                      href={`/services/${cat.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 hover:text-saffron-800 transition-colors"
                    >
                      <span>Explore Offerings</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/book-consultation?mode=offline`}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline"
                    >
                      Offline In-Person
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Services Detailed List */}
        <div className="space-y-8 pt-4">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-vedic-dark">
                All Available Consultations, Pujas & Dikshas
              </h2>
              <p className="text-xs sm:text-sm text-vedic-muted mt-1">
                Select any offering below to read methodology, scriptural benefits, and schedule your online or offline appointment.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/book-consultation?mode=offline"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Offline Booking Form</span>
              </Link>
            </div>
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
                  
                  <span className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 rounded text-xs font-bold text-saffron-700 shadow-xs">
                    Starts ₹{service.priceStartingFrom.toLocaleString("en-IN")}
                  </span>

                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-vedic-dark/80 text-white text-[10px] font-bold uppercase tracking-wider">
                    {service.categoryId.toUpperCase()}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-vedic-dark group-hover:text-saffron-700 transition-colors leading-snug">
                      <Link href={`/services/${service.slug}`}>
                        {service.title}
                      </Link>
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

                  {/* Dual Booking CTAs */}
                  <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-xs font-semibold text-vedic-muted hover:text-vedic-dark"
                    >
                      Details
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/book-consultation?service=${service.slug}&mode=offline`}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold border border-emerald-200 transition-colors"
                      >
                        Offline
                      </Link>
                      <Link
                        href={`/book-consultation?service=${service.slug}&mode=online`}
                        className="px-3.5 py-1.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        Book Online
                      </Link>
                    </div>
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
