import React from "react";
import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/constants";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Ashram Directions | Astro Raj - Astrologer Rajat Thakur",
  description:
    "Get in touch with Astrologer Rajat Thakur in Muni Ki Reti, Rishikesh. Direct phone, WhatsApp consultation booking, and holy ashram address.",
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    SITE_SETTINGS.whatsappMessage
  )}`;

  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
            <span>Rishikesh Ashram & Direct Connect</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight">
            Contact Astrologer Rajat Thakur
          </h1>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            Have questions regarding personal consultations, Rishikesh puja muhurat, or certified gemstones? We are here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact & Ashram Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-vedic-dark border-b border-border pb-3">
                Direct Communication Channels
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Phone */}
                <a
                  href={`tel:${SITE_SETTINGS.cleanPhone}`}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-ivory hover:bg-ivory-card transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center shrink-0 group-hover:bg-saffron-600 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-vedic-muted block">Direct Phone Call</span>
                    <span className="font-semibold text-vedic-dark">{SITE_SETTINGS.phone}</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-800 block">WhatsApp Support & Booking</span>
                    <span className="font-semibold text-emerald-950">+91 6398-754093</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${SITE_SETTINGS.email}`}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-ivory hover:bg-ivory-card transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-vedic-muted block">Official Email</span>
                    <span className="font-semibold text-vedic-dark">{SITE_SETTINGS.email}</span>
                  </div>
                </a>

                {/* Ashram Location */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-ivory">
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-vedic-muted block">Ashram Address</span>
                    <span className="font-semibold text-vedic-dark leading-relaxed">
                      {SITE_SETTINGS.address}
                    </span>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-ivory">
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-vedic-muted block">Consultation Hours</span>
                    <span className="font-semibold text-vedic-dark">
                      {SITE_SETTINGS.officeHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-vedic-dark">
                Send a Message to Guruji
              </h2>
              <p className="text-xs text-vedic-muted mt-1">
                Fill in your details below and our Rishikesh team will get back to you with guidance.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>

        {/* Google Maps Embed Section */}
        <div className="bg-white rounded-3xl border border-border p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-vedic-dark">
                Rishikesh Ashram Location
              </h3>
              <p className="text-xs text-vedic-muted">
                Shisham Jhari, near Hemkund Sahib Gurudwara, Muni Ki Reti, Rishikesh
              </p>
            </div>
            <a
              href="https://maps.google.com/maps?q=Shisham+Jhari+Muni+Ki+Reti+Rishikesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-saffron-700 hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>

          <div className="h-80 w-full rounded-2xl overflow-hidden border border-border">
            <iframe
              src={SITE_SETTINGS.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Astro Raj Rishikesh Ashram Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
