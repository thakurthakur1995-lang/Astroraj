import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, ShieldCheck, Check } from "lucide-react";
import { Service } from "@/lib/types";

interface PopularServicesProps {
  services: Service[];
}

export function PopularServices({ services }: PopularServicesProps) {
  const featured = services.slice(0, 6);

  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
              <span>Guidance & Havans</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
              Popular Services & Consultations
            </h2>
            <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
              Every consultation and puja is conducted personally under strict Vedic tenets. Transparent pricing with audio & video options.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition-colors"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Header */}
              <div className="relative h-52 w-full overflow-hidden bg-ivory-card">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vedic-dark/80 via-transparent to-transparent" />
                
                {/* Price Tag */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg shadow-sm">
                  <span className="text-[11px] text-vedic-muted font-medium block">Starting from</span>
                  <span className="font-serif text-base font-bold text-saffron-700">
                    ₹{service.priceStartingFrom.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Category Tag */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-vedic-dark/80 text-white text-[11px] font-semibold uppercase tracking-wider">
                  {service.categoryId.toUpperCase()}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-vedic-dark leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-vedic-muted line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Bullet Benefits */}
                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    {service.benefits.slice(0, 2).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-vedic-dark">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-semibold text-vedic-muted hover:text-vedic-dark transition-colors"
                  >
                    View Details
                  </Link>

                  <Link
                    href={`/book-consultation?service=${service.slug}`}
                    className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-semibold rounded-lg shadow-xs hover:shadow-md transition-all"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
