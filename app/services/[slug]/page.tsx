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
  Video,
  Globe,
  Building,
  Home,
  Compass,
  Flame,
  Leaf
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

function resolveSlug(slug: string): string {
  if (slug === "pooja-services") return "online-puja";
  if (slug === "ayurveda-consultation") return "ayurveda";
  return slug;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const targetSlug = resolveSlug(slug);
  const categories = await getServiceCategories();
  const matchedCategory = categories.find((c) => c.slug === targetSlug);

  if (matchedCategory) {
    return {
      title: `${matchedCategory.title} | Astro Raj`,
      description: matchedCategory.shortDescription,
    };
  }

  const service = await getServiceBySlug(targetSlug);
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
  const targetSlug = resolveSlug(slug);
  const categories = await getServiceCategories();
  const services = await getServices();

  const matchedCategory = categories.find((c) => c.slug === targetSlug);
  const matchedService = services.find((s) => s.slug === targetSlug);

  // ==========================================
  // CATEGORY LANDING PAGE VIEW
  // ==========================================
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
                {matchedCategory.badge || "Vedic Category"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                Online & Offline In-Person Available
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight">
              {matchedCategory.title}
            </h1>
            <p className="text-base sm:text-lg text-vedic-muted max-w-3xl leading-relaxed">
              {matchedCategory.longDescription}
            </p>
            
            {/* Dual CTAs in Hero */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={`/book-consultation?service=${categoryServices[0]?.slug || ""}&mode=online`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>Book Online Consultation</span>
              </Link>

              <Link
                href={`/book-consultation?service=${categoryServices[0]?.slug || ""}&mode=offline`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                <Building className="w-4 h-4" />
                <span>Book Offline (In-Person / WhatsApp)</span>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-ivory hover:bg-ivory-card text-vedic-dark border border-border font-semibold text-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Query</span>
              </a>
            </div>
          </div>

          {/* Online vs Offline Explainer Card */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-vedic-dark mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-saffron-600" />
              <span>How {matchedCategory.title} Works (Online vs Offline)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-saffron-50/50 border border-saffron-200/60 space-y-2">
                <div className="font-bold text-sm text-saffron-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-saffron-700" />
                  <span>1. Online Consultation Mode</span>
                </div>
                <ul className="text-xs text-vedic-muted space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Direct 1-on-1 Audio or HD Video call with Guruji from anywhere.</li>
                  <li>Live horoscope preparation or digital floor map review.</li>
                  <li>Online Pujas streamed live from Rishikesh with personalized Sankalp.</li>
                  <li>Instant calendar slot confirmation via secure Razorpay checkout.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-2">
                <div className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-700" />
                  <span>2. Offline Consultation Mode (Ashram / Site Visit)</span>
                </div>
                <ul className="text-xs text-vedic-muted space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>In-Person consultation at our Rishikesh Ashram (Shisham Jhari, Muni Ki Reti).</li>
                  <li>On-Site property visits available for Residential, Commercial & Industrial Vastu.</li>
                  <li>Fill your details in the Offline form; all information is forwarded to Admin WhatsApp.</li>
                  <li>Manual payment (UPI/Bank Transfer) is coordinated directly with the ashram coordinator.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Special Highlights for Mantra Diksha 7 Deities */}
          {matchedCategory.id === "mantra-diksha" && (
            <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-700">
                  Seven Sacred Deity Traditions
                </span>
                <h2 className="font-serif text-2xl font-bold text-vedic-dark">
                  Initiation into the 7 Divine Deities
                </h2>
                <p className="text-xs sm:text-sm text-vedic-muted">
                  Each seeker receives personalized Diksha according to their Janma Kundli, Ishta Devata, and spiritual karma.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {[
                  { name: "Dash Mahavidya", desc: "10 Cosmic Wisdom Goddesses (Kali, Tara, Tripurasundari...)" },
                  { name: "Asht Bhairav", desc: "8 Sacred Bhairavas for fearlessness & Rahu/Ketu/Shani defense" },
                  { name: "Swarnakarshan Bhairav", desc: "Supreme wealth deity for debt freedom & golden prosperity" },
                  { name: "Lord Shiv", desc: "Mahamrityunjaya, Rudra & Panchakshari Upasana for health & Moksha" },
                  { name: "Lord Ganesh", desc: "Uchchhishta & Haridra Ganapati for instant obstacle destruction" },
                  { name: "Lord Narayan", desc: "Maha Vishnu, Narayana Kavach & Gopal Mantra for family fortune" },
                  { name: "Lord Sudarshan", desc: "Cosmic weapon of protection against enemies & dark occult" },
                ].map((deity, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-ivory border border-border space-y-1">
                    <div className="text-xs font-bold text-vedic-dark">{deity.name}</div>
                    <div className="text-[11px] text-vedic-muted leading-snug">{deity.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services List in Category */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-vedic-dark">
              Available Offerings & Rituals in this Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-48 w-full bg-ivory-card">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-vedic-dark/70 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-white/95 px-2 py-0.5 rounded text-xs font-bold text-saffron-700 shadow-xs">
                      From ₹{service.priceStartingFrom.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-serif text-base font-bold text-vedic-dark group-hover:text-saffron-700 transition-colors">
                        <Link href={`/services/${service.slug}`}>
                          {service.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-vedic-muted line-clamp-2 mt-1">
                        {service.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-xs font-semibold text-vedic-muted hover:text-vedic-dark"
                      >
                        Details
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/book-consultation?service=${service.slug}&mode=offline`}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold border border-emerald-200"
                        >
                          Offline
                        </Link>
                        <Link
                          href={`/book-consultation?service=${service.slug}&mode=online`}
                          className="px-3.5 py-1.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg text-xs font-semibold shadow-xs"
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

  // ==========================================
  // INDIVIDUAL SERVICE DETAIL PAGE
  // ==========================================
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
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
                  {matchedService.categoryId.toUpperCase()} GUIDANCE
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                  Online & Offline Available
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight">
                {matchedService.title}
              </h1>
              <p className="text-base text-vedic-muted leading-relaxed">
                {matchedService.fullDescription}
              </p>

              {/* Price & Dual CTAs */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs text-vedic-muted block">Consultation Fee</span>
                    <span className="font-serif text-2xl font-bold text-saffron-700">
                      Starts ₹{matchedService.priceStartingFrom.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/book-consultation?service=${matchedService.slug}&mode=online`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Book Online (Audio / Video)</span>
                  </Link>

                  <Link
                    href={`/book-consultation?service=${matchedService.slug}&mode=offline`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Building className="w-4 h-4" />
                    <span>Book Offline (In-Person / WhatsApp)</span>
                  </Link>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-ivory hover:bg-ivory-card text-vedic-dark border border-border font-semibold text-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
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

        {/* Offline Consultation Explainer Box */}
        <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-sm text-vedic-dark flex items-center gap-2">
              <Building className="w-4 h-4 text-saffron-700" />
              <span>Prefer an In-Person Consultation at Rishikesh Ashram or On-Site Visit?</span>
            </div>
            <p className="text-xs text-vedic-muted leading-relaxed max-w-2xl">
              Fill the offline consultation form with your details. Our coordinator receives your request on Admin WhatsApp, coordinates your slot with Guruji, and provides manual payment details (UPI/Bank Transfer).
            </p>
          </div>
          <Link
            href={`/book-consultation?service=${matchedService.slug}&mode=offline`}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Book Offline via WhatsApp</span>
          </Link>
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
        <div className="p-8 sm:p-10 rounded-3xl bg-vedic-dark text-white text-center space-y-5 shadow-xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Ready to Schedule Your Session for {matchedService.title}?
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-lg mx-auto">
            Choose online live consultation with instant calendar confirmation or offline in-person session with manual payment coordination.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/book-consultation?service=${matchedService.slug}&mode=online`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md"
            >
              <Globe className="w-4 h-4" />
              <span>Book Online (Audio / Video)</span>
            </Link>

            <Link
              href={`/book-consultation?service=${matchedService.slug}&mode=offline`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md"
            >
              <Building className="w-4 h-4" />
              <span>Book Offline (In-Person / WhatsApp)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
