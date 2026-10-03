"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Award,
  Video,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { Course } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { courseToProduct } from "@/lib/data/courses";
import { SITE_SETTINGS } from "@/lib/constants";

interface CoursesCatalogProps {
  courses: Course[];
}

export function CoursesCatalog({ courses }: CoursesCatalogProps) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "All Courses" },
    { id: "astrology", label: "Vedic Astrology" },
    { id: "vastu", label: "Vastu Shastra" },
    { id: "prediction", label: "Predictive Mastery" },
    { id: "numerology", label: "Numerology" },
    { id: "rudraksha", label: "Rudraksha Science" },
  ];

  const filtered = courses.filter((c) => {
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnrollClick = (course: Course) => {
    addToCart(courseToProduct(course), 1);
  };

  const whatsappGeneralUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    "Jai Guru Ji! I want admission guidance regarding Astro Raj Academy courses. Please help me choose the right course."
  )}`;

  return (
    <div className="space-y-16">
      {/* 1. Filter Controls & Search */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => {
            const count =
              cat.id === "all" ? courses.length : courses.filter((c) => c.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-saffron-600 text-white shadow-xs"
                    : "bg-ivory text-vedic-dark hover:bg-ivory-card border border-border"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.id
                      ? "bg-white/20 text-white"
                      : "bg-border/60 text-vedic-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-vedic-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses by topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-ivory rounded-xl border border-border text-xs text-vedic-dark focus:outline-hidden focus:border-saffron-600"
          />
        </div>
      </div>

      {/* 2. Courses Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-vedic-dark">No courses found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-saffron-600 text-white rounded-lg text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course) => {
            const discount = Math.round(
              ((course.originalPrice - course.price) / course.originalPrice) * 100
            );

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-border overflow-hidden hover:border-saffron-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Course Thumbnail Image */}
                <div className="relative h-56 w-full overflow-hidden bg-ivory-card">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-vedic-dark/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                    {course.categoryLabel}
                  </span>

                  {/* Level Pill */}
                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-saffron-800 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs">
                    {course.level}
                  </span>

                  {/* Mode Banner at Bottom of Image */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between text-[11px] text-amber-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificate Included</span>
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Ratings & Enrolled Count */}
                    <div className="flex items-center justify-between text-xs text-vedic-muted">
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{course.rating.toFixed(1)}</span>
                        <span className="text-vedic-muted text-[11px]">({course.reviewsCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-vedic-muted">
                        <Users className="w-3.5 h-3.5" />
                        <span>{course.studentsEnrolled.toLocaleString("en-IN")}+ enrolled</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg font-bold text-vedic-dark group-hover:text-saffron-700 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-vedic-muted line-clamp-2 leading-relaxed">
                      {course.shortDescription}
                    </p>
                  </div>

                  {/* Modules count & Key takeaway */}
                  <div className="py-2.5 px-3 bg-ivory rounded-xl border border-border/80 flex items-center justify-between text-[11px] text-vedic-dark font-medium">
                    <span className="flex items-center gap-1 text-saffron-800">
                      <BookOpen className="w-3.5 h-3.5 text-saffron-600" />
                      <span>{course.curriculum.length} Core Modules</span>
                    </span>
                    <span className="text-emerald-700 font-semibold">{course.mode}</span>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-3 border-t border-border/70 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="font-serif text-2xl font-bold text-saffron-700">
                          ₹{course.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-vedic-muted line-through ml-2">
                          ₹{course.originalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="py-2.5 px-3 rounded-xl bg-ivory hover:bg-ivory-card border border-border text-vedic-dark text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Syllabus</span>
                        <ArrowRight className="w-3.5 h-3.5 text-vedic-muted" />
                      </Link>

                      <button
                        onClick={() => handleEnrollClick(course)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-saffron-600 to-saffron-700 hover:from-saffron-700 hover:to-saffron-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                        <span>Enroll Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Why Learn from Astrologer Rajat Thakur Section */}
      <section className="bg-gradient-to-br from-vedic-dark via-vedic-brown to-vedic-dark rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sacred Knowledge Transmission</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Why Thousands of Students Choose Astro Raj Academy
          </h2>
          <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed">
            Astrology, Vastu, and Numerology are not mere theories—they are divine sciences designed to bring clarity, peace, and abundance to every household.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Direct Lineage & Certification</h3>
            <p className="text-xs text-amber-100/75 leading-relaxed">
              Learn directly from teachings blessed by Shankaracharya lineage. Earn a verified certificate recognized across India.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">100% Practical Case Studies</h3>
            <p className="text-xs text-amber-100/75 leading-relaxed">
              No boring jargon. You analyze real client horoscopes, residential floor plans, and life decisions from class one.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Lifetime Access & Doubt Support</h3>
            <p className="text-xs text-amber-100/75 leading-relaxed">
              Watch recordings anytime on your phone. Participate in weekly live Q&A sessions and private WhatsApp student cohort.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WhatsApp Quick Counselor Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-emerald-950">
              Need Help Choosing the Right Course?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800">
              Speak directly with our academic counselor on WhatsApp. We will help you select the ideal course based on your learning goals.
            </p>
          </div>
        </div>

        <a
          href={whatsappGeneralUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
