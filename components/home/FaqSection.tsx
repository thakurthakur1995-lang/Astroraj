"use client";

import React, { useState } from "react";
import Script from "next/script";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQItem } from "@/lib/types";

interface FaqSectionProps {
  faqs: FAQItem[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured Data FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-20 bg-white border-y border-border/80">
      {/* FAQ Schema */}
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            Everything you need to know about our Vedic consultations, Kundli requirements, online pujas, and certified gemstones.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="border border-border rounded-xl bg-ivory overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-bold text-vedic-dark hover:text-saffron-700 transition-colors focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-saffron-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-vedic-dark/85 leading-relaxed border-t border-border/60 bg-white/70">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
