"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { 
  Calendar, 
  Clock, 
  Phone, 
  Video, 
  Zap, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  MessageCircle, 
  Sparkles, 
  HelpCircle,
  FileText
} from "lucide-react";
import { SERVICES } from "@/lib/data/services";
import { CONSULTATION_PRICING_MATRIX, SITE_SETTINGS } from "@/lib/constants";
import { ConsultationType, ConsultationUrgency, BookingCustomerDetails, BookingRecord } from "@/lib/types";
import { createBooking } from "@/lib/supabase/repository";

export function BookingWizard() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");
  const preselectedPlan = searchParams.get("plan");

  // Step state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selection states
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedService || "personal-consultation"
  );
  const [consultationType, setConsultationType] = useState<ConsultationType>("audio");
  const [durationMinutes, setDurationMinutes] = useState<15 | 30>(30);
  const [urgency, setUrgency] = useState<ConsultationUrgency>("normal");

  // Date and Time Slot
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + (urgency === "urgent" ? 1 : 2));
    return d.toISOString().split("T")[0];
  };

  const [bookingDate, setBookingDate] = useState<string>(getMinDate());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("11:00 AM - 11:30 AM");

  // Customer Details Form
  const [customerDetails, setCustomerDetails] = useState<BookingCustomerDetails>({
    fullName: "",
    email: "",
    phone: "",
    whatsappSameAsPhone: true,
    whatsappNumber: "",
    gender: "male",
    dateOfBirth: "1995-01-01",
    timeOfBirth: "10:30 AM",
    timeIsApproximate: false,
    placeOfBirth: "",
    preferredLanguage: "Hindi",
    concernsTopic: "Career",
    questionOrNotes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Auto-set configuration if plan was passed in URL query
  useEffect(() => {
    if (preselectedPlan) {
      if (preselectedPlan.includes("video")) setConsultationType("video");
      if (preselectedPlan.includes("15")) setDurationMinutes(15);
      if (preselectedPlan.includes("urgent")) setUrgency("urgent");
    }
  }, [preselectedPlan]);

  // Calculate pricing from matrix
  const currentTier = CONSULTATION_PRICING_MATRIX.find(
    (tier) =>
      tier.type === consultationType &&
      tier.durationMinutes === durationMinutes &&
      tier.urgency === urgency
  ) || {
    price: 3100,
    originalPrice: 6200,
    turnaroundDays: "7-15 Days",
  };

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  // Available Time Slots
  const morningSlots = [
    "09:30 AM - 10:00 AM",
    "10:15 AM - 10:45 AM",
    "11:00 AM - 11:30 AM",
    "11:45 AM - 12:15 PM",
  ];
  const afternoonSlots = [
    "02:00 PM - 02:30 PM",
    "02:45 PM - 03:15 PM",
    "03:30 PM - 04:00 PM",
    "04:15 PM - 04:45 PM",
  ];
  const eveningSlots = [
    "05:30 PM - 06:00 PM",
    "06:15 PM - 06:45 PM",
    "07:00 PM - 07:30 PM",
  ];

  // Validation
  const validateCustomerDetails = () => {
    const errors: Record<string, string> = {};
    if (!customerDetails.fullName.trim()) errors.fullName = "Please enter your full name.";
    if (!customerDetails.email.trim() || !customerDetails.email.includes("@")) {
      errors.email = "Please enter a valid email address.";
    }
    if (!customerDetails.phone.trim() || customerDetails.phone.length < 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!customerDetails.placeOfBirth.trim()) {
      errors.placeOfBirth = "Please enter your city/place of birth.";
    }
    if (!customerDetails.dateOfBirth) {
      errors.dateOfBirth = "Please select your date of birth.";
    }
    if (!customerDetails.timeOfBirth.trim()) {
      errors.timeOfBirth = "Please enter your approximate time of birth.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Payment Execution
  const handlePayment = async () => {
    setIsProcessingPayment(true);

    try {
      const bookingData = {
        serviceId: selectedService.id,
        serviceTitle: `${selectedService.title} (${durationMinutes} Min ${
          consultationType === "video" ? "Video" : "Audio"
        })`,
        consultationType,
        durationMinutes,
        urgency,
        date: bookingDate,
        timeSlot: selectedTimeSlot,
        price: currentTier.price,
        originalPrice: currentTier.originalPrice,
        ...customerDetails,
        status: "confirmed" as const,
        paymentStatus: "paid" as const,
        paymentId: `pay_${Date.now()}`,
      };

      const record = await createBooking(bookingData);
      setConfirmedBooking(record);
      setCurrentStep(6); // Step 6: Confirmation

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d05e2d", "#d4a359", "#2d1a12"],
        });
      } catch {
        // Safe fallback
      }
    } catch {
      alert("Payment processing simulation error. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // CONFIRMATION SCREEN (Step 6)
  if (currentStep === 6 && confirmedBooking) {
    const whatsappText = `Hari Om Guruji! My Booking ID is ${confirmedBooking.bookingCode} for ${confirmedBooking.serviceTitle} on ${confirmedBooking.date} at ${confirmedBooking.timeSlot}. Name: ${confirmedBooking.fullName}.`;
    const waBookingUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
      whatsappText
    )}`;

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gold-400/40 p-8 sm:p-10 shadow-xl text-center space-y-6">
          {/* Success Check */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold ring-8 ring-emerald-50/50 shadow-inner">
            ✓
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Payment & Booking Confirmed
            </span>
            <h1 className="font-serif text-3xl font-bold text-vedic-dark">
              Consultation Scheduled Successfully
            </h1>
            <p className="text-sm text-vedic-muted max-w-md mx-auto">
              Your session with Astrologer Rajat Thakur is booked. A confirmation has been registered with Booking ID:
            </p>
          </div>

          {/* Booking Code Highlight */}
          <div className="p-4 bg-ivory rounded-2xl border border-border inline-block px-8">
            <span className="text-xs text-vedic-muted font-medium block">Your Booking Code</span>
            <span className="font-mono text-2xl font-bold text-saffron-700">
              {confirmedBooking.bookingCode}
            </span>
          </div>

          {/* Consultation Summary Card */}
          <div className="bg-ivory-card/60 rounded-2xl p-6 text-left border border-border space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-vedic-muted block text-xs">Service</span>
                <span className="font-semibold text-vedic-dark">{confirmedBooking.serviceTitle}</span>
              </div>
              <div>
                <span className="text-vedic-muted block text-xs">Consultation Mode</span>
                <span className="font-semibold text-vedic-dark capitalize">
                  {confirmedBooking.consultationType} Call ({confirmedBooking.durationMinutes} Mins)
                </span>
              </div>
              <div>
                <span className="text-vedic-muted block text-xs">Scheduled Date</span>
                <span className="font-semibold text-vedic-dark">{confirmedBooking.date}</span>
              </div>
              <div>
                <span className="text-vedic-muted block text-xs">Time Slot</span>
                <span className="font-semibold text-vedic-dark">{confirmedBooking.timeSlot}</span>
              </div>
              <div>
                <span className="text-vedic-muted block text-xs">Client Name</span>
                <span className="font-semibold text-vedic-dark">{confirmedBooking.fullName}</span>
              </div>
              <div>
                <span className="text-vedic-muted block text-xs">Amount Paid</span>
                <span className="font-serif font-bold text-saffron-700">
                  ₹{confirmedBooking.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={waBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ivory hover:bg-ivory-card text-vedic-dark border border-border font-semibold text-sm transition-all"
            >
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="text-xs text-vedic-muted pt-4 border-t border-border/60">
            For any queries or rescheduling requests, call our Rishikesh ashram at {SITE_SETTINGS.phone}.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vedic Appointment Engine</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-vedic-dark tracking-tight">
          Book Your Personal Consultation
        </h1>
        <p className="text-xs sm:text-sm text-vedic-muted max-w-lg mx-auto">
          Select your service, choose your preferred slot, and share your birth coordinates for deep chart preparation.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-10 bg-white rounded-2xl p-4 border border-border shadow-xs">
        <div className="flex items-center justify-between relative">
          {[
            { num: 1, label: "Service" },
            { num: 2, label: "Mode & Plan" },
            { num: 3, label: "Date & Slot" },
            { num: 4, label: "Birth Details" },
            { num: 5, label: "Review & Pay" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  currentStep === s.num
                    ? "bg-saffron-600 text-white shadow-md ring-4 ring-saffron-100"
                    : currentStep > s.num
                    ? "bg-emerald-600 text-white"
                    : "bg-ivory text-vedic-muted border border-border"
                }`}
              >
                {currentStep > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-[11px] font-semibold mt-1 hidden sm:block ${
                  currentStep === s.num ? "text-saffron-700 font-bold" : "text-vedic-muted"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: CHOOSE SERVICE */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-vedic-dark">
              Step 1: Choose Your Consultation Service
            </h2>
            <p className="text-xs text-vedic-muted">
              Select the area of life where you seek clarity and astrological guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.filter((s) => s.categoryId === "astrology" || s.categoryId === "gemstones").map(
              (service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-saffron-600 bg-saffron-50/50 shadow-md ring-1 ring-saffron-600/30"
                        : "border-border hover:border-gold-400 bg-ivory"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif text-base font-bold text-vedic-dark">
                        {service.title}
                      </h3>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-saffron-600 bg-saffron-600 text-white" : "border-border"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <p className="text-xs text-vedic-muted mt-2 line-clamp-2">
                      {service.shortDescription}
                    </p>
                    <div className="text-xs font-semibold text-saffron-700 mt-3">
                      Starts from ₹{service.priceStartingFrom.toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all"
            >
              <span>Continue to Mode & Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CHOOSE MODE & DURATION */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-vedic-dark">
              Step 2: Choose Mode, Duration & Urgency
            </h2>
            <p className="text-xs text-vedic-muted">
              Customise how and when you wish to connect with Guruji.
            </p>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
              1. Consultation Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setConsultationType("audio")}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  consultationType === "audio"
                    ? "border-saffron-600 bg-saffron-50/60 shadow-xs"
                    : "border-border bg-ivory"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-saffron-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-vedic-dark">Audio Call</div>
                  <div className="text-[11px] text-vedic-muted">Private phone session</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType("video")}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  consultationType === "video"
                    ? "border-saffron-600 bg-saffron-50/60 shadow-xs"
                    : "border-border bg-ivory"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-saffron-600">
                  <Video className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-vedic-dark">HD Video Call</div>
                  <div className="text-[11px] text-vedic-muted">Face-to-face chart review</div>
                </div>
              </button>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
              2. Session Duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDurationMinutes(15)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  durationMinutes === 15
                    ? "border-saffron-600 bg-saffron-50/60 shadow-xs"
                    : "border-border bg-ivory"
                }`}
              >
                <div className="text-sm font-bold text-vedic-dark">15 Minutes</div>
                <div className="text-[11px] text-vedic-muted">Single pressing question / quick remedy</div>
              </button>

              <button
                type="button"
                onClick={() => setDurationMinutes(30)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  durationMinutes === 30
                    ? "border-saffron-600 bg-saffron-50/60 shadow-xs"
                    : "border-border bg-ivory"
                }`}
              >
                <div className="text-sm font-bold text-vedic-dark">30 Minutes (Recommended)</div>
                <div className="text-[11px] text-vedic-muted">Comprehensive life & dasha roadmap</div>
              </button>
            </div>
          </div>

          {/* Urgency Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
              3. Scheduling Urgency
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUrgency("normal")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  urgency === "normal"
                    ? "border-saffron-600 bg-saffron-50/60 shadow-xs"
                    : "border-border bg-ivory"
                }`}
              >
                <div className="text-sm font-bold text-vedic-dark">Normal Scheduling</div>
                <div className="text-[11px] text-vedic-muted">Turnaround: 7–15 Days</div>
              </button>

              <button
                type="button"
                onClick={() => setUrgency("urgent")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  urgency === "urgent"
                    ? "border-saffron-600 bg-saffron-50/60 shadow-xs"
                    : "border-border bg-ivory"
                }`}
              >
                <div className="text-sm font-bold text-vedic-dark flex items-center gap-1 text-saffron-800">
                  <Zap className="w-3.5 h-3.5 text-saffron-600" />
                  <span>Urgent Consultation</span>
                </div>
                <div className="text-[11px] text-vedic-muted">Turnaround: Within 24 Hours</div>
              </button>
            </div>
          </div>

          {/* Price Banner */}
          <div className="p-4 bg-ivory rounded-2xl border border-gold-400/40 flex items-center justify-between">
            <div>
              <span className="text-xs text-vedic-muted block">Selected Plan Fee</span>
              <span className="font-serif text-2xl font-bold text-saffron-700">
                ₹{currentTier.price.toLocaleString("en-IN")}
              </span>
              {currentTier.originalPrice && (
                <span className="text-xs text-vedic-muted line-through ml-2">
                  ₹{currentTier.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <span className="text-xs font-semibold text-vedic-dark bg-white px-3 py-1.5 rounded-lg border border-border">
              {currentTier.turnaroundDays}
            </span>
          </div>

          {/* Navigation */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-vedic-muted hover:text-vedic-dark"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all"
            >
              <span>Continue to Slot Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CHOOSE DATE & TIME SLOT */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-vedic-dark">
              Step 3: Select Date & Available Time Slot
            </h2>
            <p className="text-xs text-vedic-muted">
              Choose an available appointment window from Guruji&apos;s Rishikesh ashram calendar.
            </p>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
              Appointment Date
            </label>
            <input
              type="date"
              min={getMinDate()}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full sm:w-64 p-3 bg-ivory rounded-xl border border-border text-sm font-semibold text-vedic-dark focus:outline-hidden focus:border-saffron-600"
            />
          </div>

          {/* Time Slots */}
          <div className="space-y-4 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
              Select Time Slot (IST)
            </label>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-gold-600 uppercase block mb-1.5">
                  Morning Slots
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedTimeSlot === slot
                          ? "bg-saffron-600 text-white border-saffron-600 shadow-xs"
                          : "bg-ivory border-border text-vedic-dark hover:border-gold-400"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gold-600 uppercase block mb-1.5">
                  Afternoon Slots
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedTimeSlot === slot
                          ? "bg-saffron-600 text-white border-saffron-600 shadow-xs"
                          : "bg-ivory border-border text-vedic-dark hover:border-gold-400"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gold-600 uppercase block mb-1.5">
                  Evening Slots
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {eveningSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedTimeSlot === slot
                          ? "bg-saffron-600 text-white border-saffron-600 shadow-xs"
                          : "bg-ivory border-border text-vedic-dark hover:border-gold-400"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-vedic-muted hover:text-vedic-dark"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all"
            >
              <span>Continue to Birth Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ENTER BIRTH & CONTACT DETAILS */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-vedic-dark">
              Step 4: Enter Client & Birth Particulars
            </h2>
            <p className="text-xs text-vedic-muted">
              Vedic Jyotish calculations rely on precise astronomical coordinates at the time of your birth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-vedic-dark">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={customerDetails.fullName}
                onChange={(e) => setCustomerDetails({ ...customerDetails, fullName: e.target.value })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              />
              {formErrors.fullName && <p className="text-xs text-red-600">{formErrors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-vedic-dark">Email Address *</label>
              <input
                type="email"
                placeholder="e.g. rahul@example.com"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              />
              {formErrors.email && <p className="text-xs text-red-600">{formErrors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-vedic-dark">Phone Number (10 Digits) *</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              />
              {formErrors.phone && <p className="text-xs text-red-600">{formErrors.phone}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-vedic-dark">Gender</label>
              <select
                value={customerDetails.gender}
                onChange={(e) => setCustomerDetails({ ...customerDetails, gender: e.target.value as any })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-vedic-dark">Date of Birth *</label>
              <input
                type="date"
                value={customerDetails.dateOfBirth}
                onChange={(e) => setCustomerDetails({ ...customerDetails, dateOfBirth: e.target.value })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              />
              {formErrors.dateOfBirth && <p className="text-xs text-red-600">{formErrors.dateOfBirth}</p>}
            </div>

            {/* Time of Birth */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-vedic-dark">Time of Birth (e.g. 10:45 AM) *</label>
              <input
                type="text"
                placeholder="e.g. 10:45 AM or approx"
                value={customerDetails.timeOfBirth}
                onChange={(e) => setCustomerDetails({ ...customerDetails, timeOfBirth: e.target.value })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              />
              {formErrors.timeOfBirth && <p className="text-xs text-red-600">{formErrors.timeOfBirth}</p>}
            </div>

            {/* Place of Birth */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-vedic-dark">Place / City of Birth (City, State, Country) *</label>
              <input
                type="text"
                placeholder="e.g. Varanasi, Uttar Pradesh, India"
                value={customerDetails.placeOfBirth}
                onChange={(e) => setCustomerDetails({ ...customerDetails, placeOfBirth: e.target.value })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              />
              {formErrors.placeOfBirth && <p className="text-xs text-red-600">{formErrors.placeOfBirth}</p>}
            </div>

            {/* Concerns Topic */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-vedic-dark">Primary Consultation Concern</label>
              <select
                value={customerDetails.concernsTopic}
                onChange={(e) => setCustomerDetails({ ...customerDetails, concernsTopic: e.target.value as any })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              >
                <option value="Career">Career & Promotion</option>
                <option value="Marriage & Relationship">Marriage & Kundli Milan</option>
                <option value="Finance & Business">Finance & Business Venture</option>
                <option value="Health">Health & Mental Vitality</option>
                <option value="Spiritual / Kundli">Spiritual Growth & Kundli Doshas</option>
                <option value="Other">General Life Path</option>
              </select>
            </div>

            {/* Language Preference */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-vedic-dark">Preferred Language</label>
              <select
                value={customerDetails.preferredLanguage}
                onChange={(e) => setCustomerDetails({ ...customerDetails, preferredLanguage: e.target.value as any })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              >
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="English">English</option>
                <option value="Both">Both / Hinglish</option>
              </select>
            </div>

            {/* Specific Questions */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-vedic-dark">Your Key Questions or Notes for Guruji</label>
              <textarea
                rows={3}
                placeholder="Feel free to outline any specific issues or milestones you wish Guruji to address..."
                value={customerDetails.questionOrNotes}
                onChange={(e) => setCustomerDetails({ ...customerDetails, questionOrNotes: e.target.value })}
                className="w-full p-3 bg-ivory rounded-xl border border-border text-sm focus:outline-hidden focus:border-saffron-600"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-vedic-muted hover:text-vedic-dark"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                if (validateCustomerDetails()) {
                  setCurrentStep(5);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md transition-all"
            >
              <span>Review Booking Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & COMPLETE PAYMENT */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-vedic-dark">
              Step 5: Review Booking & Complete Payment
            </h2>
            <p className="text-xs text-vedic-muted">
              Please review all appointment details before completing secure checkout.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-ivory rounded-2xl p-6 border border-border space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="font-serif text-lg font-bold text-vedic-dark block">
                  {selectedService.title}
                </span>
                <span className="text-xs text-saffron-700 font-semibold capitalize">
                  {consultationType} Consultation • {durationMinutes} Minutes ({urgency} scheduling)
                </span>
              </div>
              <span className="font-serif text-2xl font-bold text-saffron-700">
                ₹{currentTier.price.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-vedic-dark">
              <div>
                <span className="text-vedic-muted block text-xs">Date & Time Slot</span>
                <span className="font-semibold">{bookingDate} at {selectedTimeSlot} (IST)</span>
              </div>
              <div>
                <span className="text-vedic-muted block text-xs">Client Name & Phone</span>
                <span className="font-semibold">{customerDetails.fullName} ({customerDetails.phone})</span>
              </div>
              <div>
                <span className="text-vedic-muted block text-xs">Birth Coordinates</span>
                <span className="font-semibold">{customerDetails.dateOfBirth}, {customerDetails.timeOfBirth}</span>
              </div>
              <div>
                <span className="text-vedic-muted block text-xs">Birth Place</span>
                <span className="font-semibold">{customerDetails.placeOfBirth}</span>
              </div>
            </div>

            {customerDetails.questionOrNotes && (
              <div className="pt-2 border-t border-border/60">
                <span className="text-vedic-muted block text-xs">Question / Concern:</span>
                <p className="text-xs italic text-vedic-dark mt-0.5">{customerDetails.questionOrNotes}</p>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">100% Privacy & Sacred Conduct</span>
              <span>
                All birth data and conversations remain strictly confidential between you and Astrologer Rajat Thakur.
              </span>
            </div>
          </div>

          {/* Pay Button */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-vedic-muted hover:text-vedic-dark"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Edit</span>
            </button>

            <button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isProcessingPayment ? "Confirming Booking..." : `Pay ₹${currentTier.price.toLocaleString("en-IN")} via Razorpay`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
