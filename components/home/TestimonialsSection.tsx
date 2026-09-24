import React from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { Testimonial } from "@/lib/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
            <span>Genuine Client Experiences</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            Real feedback from individuals, families, and professionals across India and abroad who sought clarity from Astrologer Rajat Thakur.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-6 border border-border shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gold-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-saffron-200" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-vedic-dark/85 leading-relaxed italic">
                  &ldquo;{test.reviewText}&rdquo;
                </p>
              </div>

              {/* Client Info */}
              <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-vedic-dark flex items-center gap-1.5">
                    <span>{test.clientName}</span>
                    {test.verified && (
                      <span title="Verified Consultation">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-vedic-muted">
                    {test.location} • {test.serviceName}
                  </div>
                </div>

                <span className="text-[11px] text-vedic-muted">
                  {test.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
