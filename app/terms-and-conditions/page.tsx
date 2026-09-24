import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Astro Raj",
  description: "Terms and conditions governing consultation appointments and product orders on Astro Raj.",
};

export default function TermsPage() {
  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl border border-border p-8 sm:p-12 space-y-6 shadow-xs text-sm sm:text-base text-vedic-dark/85 leading-relaxed">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark">
          Terms & Conditions
        </h1>
        <p className="text-xs text-vedic-muted">Last Updated: January 2025</p>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">1. Nature of Services</h2>
          <p>
            Astro Raj provides personalized Vedic astrology consultations, online ritual pujas, certified gemstones, and traditional wellness products. By booking an appointment or placing an order, you agree to these Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">2. Consultation Appointments</h2>
          <p>
            Consultations are scheduled according to selected time slots. Normal bookings are scheduled within 7–15 days, and Urgent bookings are scheduled within 24 hours. Rescheduling is permitted up to 24 hours before the appointment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">3. Accuracy of Birth Information</h2>
          <p>
            Astrological insights depend heavily on the accuracy of Date, Time, and Place of Birth provided by the client. Astro Raj is not liable for misinterpretations resulting from erroneous birth inputs provided by the client.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">4. Jurisdictional Authority</h2>
          <p>
            Any disputes arising out of the services shall be subject to the exclusive jurisdiction of the competent courts in Rishikesh / Dehradun, Uttarakhand, India.
          </p>
        </section>
      </div>
    </div>
  );
}
