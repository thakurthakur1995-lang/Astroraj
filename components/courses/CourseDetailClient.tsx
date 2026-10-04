"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Clock,
  Video,
  Award,
  Users,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Calendar,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Course } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { courseToProduct } from "@/lib/data/courses";
import { SITE_SETTINGS } from "@/lib/constants";

interface CourseDetailClientProps {
  course: Course;
  relatedCourses: Course[];
}

export function CourseDetailClient({ course, relatedCourses }: CourseDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true, // open first module by default
  });

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const discountPercent = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100
  );

  const whatsappInquiryUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    `Jai Guru Ji! I am interested in enrolling in the "${course.title}". Please share batch timings and enrollment assistance.`
  )}`;

  return (
    <div className="space-y-12">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-vedic-muted">
        <Link href="/" className="hover:text-vedic-dark transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-vedic-dark transition-colors">
          Courses
        </Link>
        <span>/</span>
        <span className="text-vedic-dark font-medium line-clamp-1">{course.title}</span>
      </div>

      {/* 2. Main Hero & Sticky Enrollment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course Main Presentation */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Block */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-lg bg-saffron-100 text-saffron-800 text-xs font-bold uppercase tracking-wider">
                {course.categoryLabel}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-ivory text-vedic-dark border border-border text-xs font-semibold">
                {course.level} Level
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Ashram Certified</span>
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-vedic-dark leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
              {course.shortDescription}
            </p>

            {/* Metrics Bar */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-vedic-dark border-y border-border/80 py-3">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-current text-amber-500" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-vedic-muted font-normal">({course.reviewsCount} reviews)</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-saffron-600" />
                <span>{course.studentsEnrolled.toLocaleString("en-IN")}+ Enrolled Students</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-saffron-600" />
                <span>{course.duration}</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-saffron-600" />
                <span>{course.mode}</span>
              </div>
            </div>
          </div>

          {/* What You'll Learn Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-saffron-700 font-serif text-xl font-bold">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <h2>What You Will Learn in This Course</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {course.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-vedic-dark/90 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-vedic-dark">
              Course Overview & Spiritual Significance
            </h2>
            <div className="text-xs sm:text-sm text-vedic-dark/85 leading-relaxed space-y-3 whitespace-pre-line">
              {course.fullDescription}
            </div>
          </div>

          {/* Curriculum Accordion */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-vedic-dark">
                  Course Curriculum & Syllabus
                </h2>
                <p className="text-xs text-vedic-muted mt-0.5">
                  {course.curriculum.length} Structured Modules • Step-by-step video training
                </p>
              </div>

              <button
                onClick={() => {
                  const allOpen = Object.keys(expandedModules).length === course.curriculum.length;
                  const next: Record<string, boolean> = {};
                  course.curriculum.forEach((m) => {
                    next[m.id] = !allOpen;
                  });
                  setExpandedModules(next);
                }}
                className="text-xs text-saffron-700 font-semibold hover:underline text-left sm:text-right cursor-pointer"
              >
                Toggle All Modules
              </button>
            </div>

            <div className="space-y-3">
              {course.curriculum.map((mod, index) => {
                const isOpen = !!expandedModules[mod.id];
                return (
                  <div
                    key={mod.id}
                    className="border border-border rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full p-4 bg-ivory/50 hover:bg-ivory text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-saffron-100 text-saffron-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-vedic-dark">
                          {mod.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {mod.duration && (
                          <span className="text-[11px] text-vedic-muted hidden sm:inline">
                            {mod.duration}
                          </span>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-vedic-muted transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white border-t border-border/70 space-y-2">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div
                            key={lIdx}
                            className="flex items-start gap-2.5 text-xs text-vedic-dark/85 py-1 pl-2"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-saffron-600 shrink-0 mt-0.5" />
                            <span>{lesson}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Who Should Take This Course */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-vedic-dark">
              Who Should Enroll in This Program?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {course.targetAudience.map((target, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-ivory border border-border/80 text-xs text-vedic-dark">
                  <CheckCircle2 className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                  <span>{target}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meet Your Mentor Block */}
          <div className="bg-gradient-to-br from-vedic-dark via-vedic-brown to-vedic-dark rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-md">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 ring-4 ring-gold-400/30">
                <Image
                  src="https://darkcyan-marten-836084.hostingersite.com/wp-content/uploads/2025/10/fc160d79adac1616a30bd90860eba571884b7d6c-768x1024.jpg"
                  alt="Astrologer Rajat Thakur"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-400/20 text-gold-300 text-[11px] font-semibold uppercase tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Master Instructor</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Astrologer Rajat Thakur
                </h3>
                <p className="text-xs text-gold-300 font-medium">
                  Founder, Astro Raj Ashram (Rishikesh) • 15+ Years Lineage Experience
                </p>
                <p className="text-xs text-amber-100/80 leading-relaxed pt-1">
                  Blessed with Shri Vidya Diksha from Jagatguru Shankaracharya Swaroopananda Saraswati, Guruji has decoded over 50,000+ horoscopes and mentored thousands of students globally in classical Vedic sciences.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-vedic-dark">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 pt-2">
              {(course.faqs && course.faqs.length > 0 ? course.faqs : [
                {
                  question: "How will I access the course lectures?",
                  answer: "Once enrolled, you will receive student portal access credentials via Email and WhatsApp. All live session links and high-definition recordings are hosted there.",
                },
                {
                  question: "What if I miss a live class?",
                  answer: "Never worry! Every live masterclass is recorded in 1080p HD and uploaded to your dashboard within 2 hours with lifetime replay access.",
                },
                {
                  question: "Will I receive a verified certificate?",
                  answer: "Yes, upon submitting practical case studies and completing the modules, you receive an authorized Certificate of Completion signed by Astrologer Rajat Thakur.",
                },
              ]).map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-ivory border border-border/80 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-vedic-dark">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-vedic-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Pricing & Fast Enrollment Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-saffron-500/30 p-6 sm:p-8 shadow-xl space-y-6">
            {/* Thumbnail preview */}
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-ivory-card border border-border">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 right-3 bg-vedic-dark/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                {course.level}
              </span>
            </div>

            {/* Pricing Section */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-3xl font-bold text-saffron-700">
                    ₹{course.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-vedic-muted line-through ml-2">
                    ₹{course.originalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {discountPercent}% OFF
                </span>
              </div>

              {course.batchStartDate && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] font-semibold text-amber-900 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{course.batchStartDate}</span>
                </div>
              )}
            </div>

            {/* Big Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  addToCart(courseToProduct(course), 1);
                  router.push("/checkout");
                }}
                className="w-full py-4 bg-gradient-to-r from-saffron-600 via-saffron-700 to-saffron-800 hover:from-saffron-700 hover:to-saffron-900 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gold-300" />
                <span>Enroll Now & Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => addToCart(courseToProduct(course), 1)}
                className="w-full py-3.5 bg-ivory hover:bg-ivory-card border border-saffron-600/40 text-saffron-800 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-saffron-600" />
                <span>Add Course to Cart</span>
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>

            {/* What's Included Checklist */}
            <div className="pt-4 border-t border-border space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-vedic-dark">
                This Course Includes:
              </h4>
              <ul className="space-y-2 text-xs text-vedic-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lifetime access to all HD video lessons</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ashram Certified Certificate of Completion</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Downloadable PDF reference handbooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Access on Mobile, Tablet, and Desktop</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Q&A support in student group</span>
                </li>
              </ul>
            </div>

            {/* Trust and Guarantee */}
            <div className="pt-2 border-t border-border/80 flex items-center justify-between text-[11px] text-vedic-muted">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Activation</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Satisfaction</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="pt-12 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-vedic-dark">
              Other Popular Masterclasses
            </h2>
            <Link
              href="/courses"
              className="text-xs font-semibold text-saffron-700 hover:text-saffron-800 flex items-center gap-1"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCourses.map((rel) => (
              <div
                key={rel.id}
                className="bg-white rounded-2xl border border-border p-4 hover:border-saffron-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-ivory-card mb-3">
                  <Image src={rel.image} alt={rel.title} fill className="object-cover" />
                  <span className="absolute top-2 left-2 bg-vedic-dark/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {rel.categoryLabel}
                  </span>
                </div>
                <div className="space-y-1.5 mb-3">
                  <h3 className="font-serif text-sm font-bold text-vedic-dark line-clamp-1">
                    <Link href={`/courses/${rel.slug}`}>{rel.title}</Link>
                  </h3>
                  <p className="text-[11px] text-vedic-muted line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-serif text-base font-bold text-saffron-700">
                    ₹{rel.price.toLocaleString("en-IN")}
                  </span>
                  <Link
                    href={`/courses/${rel.slug}`}
                    className="px-3 py-1.5 bg-saffron-600 text-white text-xs font-bold rounded-lg hover:bg-saffron-700 transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
