"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  GraduationCap, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle,
  Users,
  Flame
} from "lucide-react";
import { Course } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { courseToProduct } from "@/lib/data/courses";
import { SITE_SETTINGS } from "@/lib/constants";

interface CoursesPreviewProps {
  courses: Course[];
}

export function CoursesPreview({ courses }: CoursesPreviewProps) {
  const { addToCart } = useCart();

  // Pick top 3-4 courses for homepage showcase
  const featuredCourses = courses.slice(0, 3);

  const counselorWhatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    "Hari Om! I am interested in joining Astro Raj Academy courses. Please help me choose the right course."
  )}`;

  return (
    <section className="py-20 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-stone-100 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-saffron-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-400/30 text-saffron-300 text-xs font-semibold tracking-wide uppercase">
            <GraduationCap className="w-4 h-4 text-gold-400" />
            <span>Astro Raj Vedic Academy</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Master Vedic Science with{" "}
            <span className="bg-gradient-to-r from-gold-300 via-amber-200 to-saffron-400 bg-clip-text text-transparent">
              Live Mentorship
            </span>
          </h2>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            Practical, authentic certification courses designed to transform enthusiastic learners into confident professional astrologers, Vastu consultants, and spiritual practitioners.
          </p>

          {/* Quick Value Pillars */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-amber-200/90">
            <span className="flex items-center gap-1.5 bg-stone-800/70 px-3 py-1 rounded-full border border-gold-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
              Live Interactive Batches
            </span>
            <span className="flex items-center gap-1.5 bg-stone-800/70 px-3 py-1 rounded-full border border-gold-500/20">
              <Award className="w-3.5 h-3.5 text-gold-400" />
              Certificate of Completion
            </span>
            <span className="flex items-center gap-1.5 bg-stone-800/70 px-3 py-1 rounded-full border border-gold-500/20">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Lifetime Recording Access
            </span>
          </div>
        </div>

        {/* Featured Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredCourses.map((course) => {
            const discountPercent = course.originalPrice
              ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
              : null;

            return (
              <div
                key={course.id}
                className="group relative flex flex-col bg-stone-900/80 rounded-2xl border border-gold-500/20 hover:border-gold-400/60 shadow-xl hover:shadow-2xl hover:shadow-saffron-500/10 transition-all duration-300 overflow-hidden"
              >
                {/* Course Image Link */}
                <Link
                  href={`/courses/${course.slug}`}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-stone-950 block cursor-pointer"
                >
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Level & Discount Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-900/90 text-amber-200 border border-gold-400/30 backdrop-blur-sm">
                      {course.level}
                    </span>
                    {discountPercent && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-gradient-to-r from-saffron-600 to-amber-600 text-white shadow">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Enrolled Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/90 border border-gold-500/20 text-stone-200 text-xs backdrop-blur-sm">
                    <Users className="w-3.5 h-3.5 text-gold-400" />
                    <span>{course.studentsEnrolled}+ Students</span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      {course.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                      {course.curriculum.length} Modules
                    </span>
                  </div>

                  <Link href={`/courses/${course.slug}`} className="cursor-pointer">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-1 mb-2">
                      {course.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-stone-300/90 leading-relaxed line-clamp-2 mb-4">
                    {course.shortDescription}
                  </p>

                  {/* Key Highlights list */}
                  <div className="space-y-1.5 mb-6 text-xs text-stone-300">
                    {course.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-gold-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-auto pt-4 border-t border-stone-800/80 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-2xl font-bold text-white">
                          ₹{course.price.toLocaleString("en-IN")}
                        </span>
                        {course.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{course.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold block">
                        Inclusive of Certificate
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(courseToProduct(course), 1)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-saffron-600 via-saffron-500 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-saffron-500/20 hover:shadow-saffron-500/40 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Enroll</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-stone-900/90 via-vedic-brown/40 to-stone-900/90 border border-gold-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-saffron-500/20 border border-saffron-500/40 flex items-center justify-center shrink-0 text-saffron-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">
                Ready to Become a Certified Vedic Consultant?
              </h4>
              <p className="text-xs text-stone-300">
                Explore our full syllabus across Vedic Astrology, Vastu Shastra, Blank Chart, and Numerology.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <a
              href={counselorWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-md transition-all cursor-pointer w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Talk to Course Counselor</span>
            </a>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-stone-950 font-bold text-xs tracking-wide shadow-md hover:shadow-gold-500/30 transition-all cursor-pointer w-full sm:w-auto"
            >
              <span>View All 6 Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
