import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy | Astro Raj",
  description: "Refund and cancellation policy for consultation appointments, online pujas, and certified physical articles on Astro Raj.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl border border-border p-8 sm:p-12 space-y-6 shadow-xs text-sm sm:text-base text-vedic-dark/85 leading-relaxed">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-vedic-muted">Last Updated: January 2025</p>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">1. Consultation Cancellations & Rescheduling</h2>
          <p>
            Clients may request to reschedule their consultation up to 24 hours prior to the scheduled slot without penalty. If a cancellation is requested more than 24 hours in advance, a full refund will be initiated minus payment gateway processing charges (typically 2-3%). Once Guruji has completed chart preparation or the consultation session has taken place, consultation fees are non-refundable.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">2. Online Puja & Havans</h2>
          <p>
            Due to the sacred procurement of ritual samagri and preliminary Sankalp ceremonies, puja bookings cannot be cancelled once holy materials have been prepared. If an unavoidable ashram conflict arises, the puja will be rescheduled to the next auspicious muhurat.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">3. Physical Articles (Gemstones, Yantras, Herbs)</h2>
          <p>
            In the rare event that a physical product arrives damaged during transit, notify us within 48 hours of delivery with unboxing photographs or video. We will arrange an immediate replacement or full refund after inspection. Custom-energized personalized items cannot be returned for change of mind once consecrated.
          </p>
        </section>
      </div>
    </div>
  );
}
