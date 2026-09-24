import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Calendar, FileText, CreditCard, Sparkles } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      stepNumber: "01",
      icon: Clock,
      title: "Choose Consultation Mode",
      description: "Select Audio or Video call and choose duration (15 or 30 minutes) based on the depth of your questions.",
    },
    {
      stepNumber: "02",
      icon: Calendar,
      title: "Select Urgency & Date Slot",
      description: "Pick standard turnaround (7-15 days) or Urgent Consultation (within 24 hours), then select your preferred time slot.",
    },
    {
      stepNumber: "03",
      icon: FileText,
      title: "Enter Birth Particulars",
      description: "Provide accurate Date of Birth, Time of Birth, and Place of Birth along with your main queries for prior chart preparation.",
    },
    {
      stepNumber: "04",
      icon: CreditCard,
      title: "Secure Checkout",
      description: "Complete payment smoothly through Razorpay using UPI, Cards, Net Banking, or Wallets with instant digital confirmation.",
    },
    {
      stepNumber: "05",
      icon: Sparkles,
      title: "Direct 1-on-1 Consultation",
      description: "Guruji connects with you directly at the appointed time with personalized chart findings, remedies, and dedicated Q&A.",
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
            <span>Seamless Experience</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
            How Consultation Booking Works
          </h2>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            A transparent 5-step journey designed for maximum convenience, privacy, and spiritual depth.
          </p>
        </div>

        {/* Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-ivory rounded-2xl p-6 border border-border flex flex-col justify-between hover:border-saffron-500/50 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                {/* Step Number Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl font-bold text-gold-500/80">
                    {item.stepNumber}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-serif text-base font-bold text-vedic-dark">
                    {item.title}
                  </h3>
                  <p className="text-xs text-vedic-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Status Dot */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simple & Secure</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA underneath */}
        <div className="mt-12 text-center">
          <Link
            href="/book-consultation"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <span>Book Your Consultation Slot Now</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
