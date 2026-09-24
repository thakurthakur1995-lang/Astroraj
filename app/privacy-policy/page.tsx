import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Astro Raj",
  description: "Privacy policy and data protection commitments of Astro Raj and Astrologer Rajat Thakur.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl border border-border p-8 sm:p-12 space-y-6 shadow-xs text-sm sm:text-base text-vedic-dark/85 leading-relaxed">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark">
          Privacy Policy
        </h1>
        <p className="text-xs text-vedic-muted">
          Last Updated: January 2025
        </p>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">1. Sacred Trust & Data Protection</h2>
          <p>
            At Astro Raj (astroraj.org), led by Astrologer Rajat Thakur, we treat all birth information and personal communications with utmost reverence and confidentiality. We do not sell, lease, rent, or trade your personal or birth details with any third-party marketing companies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">2. Information We Collect</h2>
          <p>
            To provide precise astrological calculations and ensure seamless order fulfillment, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Full Name, Contact Number, Email Address, and WhatsApp number</li>
            <li>Birth Coordinates: Date of Birth, Exact Time of Birth, and Place of Birth</li>
            <li>Shipping Address (for consecrated gemstone, yantra, and herbal product delivery)</li>
            <li>Payment transaction identifiers (we do NOT store credit/debit card details on our servers; payments are processed securely through Razorpay)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">3. Usage of Information</h2>
          <p>
            Your details are used solely for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Generating and studying your birth chart and divisional charts prior to your consultation</li>
            <li>Facilitating direct audio or video consultation with Guruji</li>
            <li>Consecrating items with personalized Sankalp (Gotra and Name recitation) in Rishikesh</li>
            <li>Dispatching courier parcels and providing real-time tracking updates</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-vedic-dark">4. Contact Information</h2>
          <p>
            For any questions regarding our privacy practices, please contact us at info@astroraj.org or WhatsApp +91 6398-754093.
          </p>
        </section>
      </div>
    </div>
  );
}
