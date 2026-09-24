import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { 
  Check, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  PhoneCall, 
  MessageCircle,
  Video
} from "lucide-react";
import { 
  getServices, 
  getServiceBySlug, 
  getServiceCategories 
} from "@/lib/supabase/repository";
import { SITE_SETTINGS } from "@/lib/constants";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getServiceCategories();
  const matchedCategory = categories.find((c) => c.slug === slug);

  if (matchedCategory) {
    return {
      title: `${matchedCategory.title} | Astro Raj`,
      description: matchedCategory.shortDescription,
    };
  }

  const service = await getServiceBySlug(slug);
  if (service) {
    return {
      title: `${service.title} | Astro Raj - Astrologer Rajat Thakur`,
      description: service.shortDescription,
    };
  }

  return {
    title: "Vedic Services | Astro Raj",
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const categories = await getServiceCategories();
  const services = await getServices();

  const matchedCategory = categories.find((c) => c.slug === slug);
  const matchedService = services.find((s) => s.slug === slug);

  // IF IT'S A CATEGORY LANDING PAGE
  if (matchedCategory) {
    const categoryServices = services.filter((s) => s.categoryId === matchedCategory.id);
    const whatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
      `Hari Om Guruji! I would like to inquire about ${matchedCategory.title}.`
    )}`;

    return (
      <div className="bg-ivory min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Category Hero */}
          <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 shadow-xs space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
              <span>{matchedCategory.badge || "Vedic Category"}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight">
              {matchedCategory.title}
            </h1>
            <p className="text-base sm:text-lg text-vedic-muted max-w-3xl leading-relaxed">
              {matchedCategory.longDescription}
            </p>
            
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/book-consultation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Live Consultation</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Query</span>
              </a>
            </div>
          </div>

          {/* Services List in Category */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-vedic-dark">
              Available Rituals & Consultations in this Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-ivory-card">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-vedic-dark/70 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-white/95 px-2 py-0.5 rounded text-xs font-bold text-saffron-700">
                      From ₹{service.priceStartingFrom.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-serif text-base font-bold text-vedic-dark">
                        {service.title}
                      </h3>
                      <p className="text-xs text-vedic-muted line-clamp-2 mt-1">
                        {service.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-xs font-semibold text-vedic-muted hover:text-vedic-dark"
                      >
                        Read Details
                      </Link>
                      <Link
                        href={`/book-consultation?service=${service.slug}`}
                        className="px-3.5 py-1.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg text-xs font-semibold"
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

  // IF IT'S AN INDIVIDUAL SERVICE DETAIL PAGE
  if (!matchedService) {
    notFound();
  }

  const whatsappInquiryUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    `Hari Om Guruji! I would like to consult regarding "${matchedService.title}".`
  )}`;

  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Service Hero */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
                <span>{matchedService.categoryId.toUpperCase()} GUIDANCE</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight">
                {matchedService.title}
              </h1>
              <p className="text-base text-vedic-muted leading-relaxed">
                {matchedService.fullDescription}
              </p>

              {/* Price & CTA */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <div className="pr-4 border-r border-border">
                  <span className="text-xs text-vedic-muted block">Consultation Fee</span>
                  <span className="font-serif text-2xl font-bold text-saffron-700">
                    From ₹{matchedService.priceStartingFrom.toLocaleString("en-IN")}
                  </span>
                </div>

                <Link
                  href={`/book-consultation?service=${matchedService.slug}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation Now</span>
                </Link>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Service Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-lg border border-border">
                <Image
                  src={matchedService.image}
                  alt={matchedService.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Inclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Benefits */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-vedic-dark flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saffron-600" />
              <span>Key Benefits & Insights</span>
            </h2>
            <div className="space-y-3">
              {matchedService.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-vedic-dark">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-vedic-dark flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-600" />
              <span>What is Included in Your Session</span>
            </h2>
            <div className="space-y-3">
              {matchedService.inclusions.map((inclusion, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-vedic-dark">
                  <div className="w-5 h-5 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{inclusion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-vedic-dark">
            Consultation Step-by-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {matchedService.processSteps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-ivory border border-border space-y-2">
                <span className="text-xs font-bold text-saffron-700 uppercase">
                  Step 0{idx + 1}
                </span>
                <h3 className="font-serif text-sm font-bold text-vedic-dark">
                  {step.title}
                </h3>
                <p className="text-xs text-vedic-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs for Service */}
        {matchedService.faqs && matchedService.faqs.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-vedic-dark flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-saffron-600" />
              <span>Frequently Asked Questions</span>
            </h2>
            <div className="space-y-3">
              {matchedService.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-ivory border border-border space-y-1">
                  <h3 className="font-semibold text-sm text-vedic-dark">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-vedic-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Card */}
        <div className="p-8 rounded-3xl bg-vedic-dark text-white text-center space-y-4 shadow-xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Ready to Schedule Your Session for {matchedService.title}?
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-lg mx-auto">
            Direct 1-on-1 audio or HD video call with Astrologer Rajat Thakur. No fear tactics, only constructive Vedic clarity.
          </p>
          <div className="pt-2">
            <Link
              href={`/book-consultation?service=${matchedService.slug}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
