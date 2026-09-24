import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astrological & Ethical Disclaimer | Astro Raj",
  description: "Responsible and ethical astrology disclaimer of Astrologer Rajat Thakur and Astro Raj.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl border border-border p-8 sm:p-12 space-y-6 shadow-xs text-sm sm:text-base text-vedic-dark/85 leading-relaxed">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark">
          Astrological & Ethical Disclaimer
        </h1>
        <p className="text-xs text-vedic-muted">Last Updated: January 2025</p>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">1. Spiritual Guidance, Not Medical or Legal Counsel</h2>
          <p>
            Vedic Astrology (Jyotish) is an ancient, observational, and metaphysical system designed to bring spiritual insight, self-awareness, and holistic life perspective. Astrological consultations, birth chart readings, and remedial suggestions provided by <strong>Astrologer Rajat Thakur</strong> are intended strictly for educational, introspective, and spiritual guidance.
          </p>
          <p>
            Astrology is <strong>NOT</strong> a substitute for professional medical diagnosis, psychiatric therapy, legal representation, or certified financial advisory services. If you are experiencing severe physical illness, clinical depression, or legal distress, please seek licensed professionals immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">2. No Guaranteed Future Outcomes</h2>
          <p>
            In authentic Vedic philosophy, human existence operates through a dynamic combination of <em>Prarabdha Karma</em> (past impressions) and <em>Purushartha</em> (conscious present free will and effort). No astrologer can alter cosmic law or guarantee deterministic future windfalls, instantaneous wealth, or miracle cures. All remedial havans, gemstone recommendations, and mantras are spiritual disciplines aimed at purifying inner consciousness.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">3. Rejection of Superstition & Fear Marketing</h2>
          <p>
            Astro Raj upholds the sacred lineage of Shri Vidya Upasana and firmly rejects all fear-based threats, curses, black magic extortion, or synthetic panic marketing. Every seeker is treated with dignity, compassion, and transparent honesty.
          </p>
        </section>
      </div>
    </div>
  );
}
