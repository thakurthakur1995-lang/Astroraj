"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactMessage } from "@/lib/supabase/repository";

export function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitContactMessage(formData);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setError("An error occurred sending your message. Please try WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="font-serif text-lg font-bold text-emerald-950">
          Message Received Successfully
        </h3>
        <p className="text-xs text-emerald-800 max-w-sm mx-auto">
          Hari Om! Guruji&apos;s team at the Rishikesh ashram will respond to your inquiry via email or WhatsApp shortly.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-xs font-semibold text-emerald-700 underline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-vedic-dark">Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Ramesh Chandra"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-vedic-dark">Email Address *</label>
          <input
            type="email"
            required
            placeholder="e.g. ramesh@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-vedic-dark">Phone Number (With Country Code) *</label>
          <input
            type="tel"
            required
            placeholder="e.g. +91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-vedic-dark">Inquiry Subject</label>
          <input
            type="text"
            placeholder="e.g. Baglamukhi Puja / Gemstone Query"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-vedic-dark">Your Message / Query *</label>
        <textarea
          rows={4}
          required
          placeholder="Please describe your spiritual query or questions about ashram rituals..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
      </button>
    </form>
  );
}
