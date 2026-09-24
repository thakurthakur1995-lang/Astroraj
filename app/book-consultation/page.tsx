import React, { Suspense } from "react";
import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book Astrology Consultation | Astrologer Rajat Thakur",
  description:
    "Schedule your one-on-one Vedic astrology, Kundli analysis, marriage compatibility, or career consultation with Astrologer Rajat Thakur in Rishikesh.",
};

export default function BookConsultationPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-saffron-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-vedic-muted">
              Loading Consultation Booking Engine...
            </p>
          </div>
        }
      >
        <BookingWizard />
      </Suspense>
    </div>
  );
}
