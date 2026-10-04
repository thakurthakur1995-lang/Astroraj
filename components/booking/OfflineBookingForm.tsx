"use client";

import React, { useState, useEffect } from "react";
import { 
  Compass, 
  Home, 
  Flame, 
  Sparkles, 
  Leaf, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building,
  HelpCircle,
  FileText
} from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES } from "@/lib/data/services";
import { SITE_SETTINGS } from "@/lib/constants";

interface OfflineBookingFormProps {
  initialCategory?: string;
  initialServiceId?: string;
  onSuccess?: (code: string, waUrl: string) => void;
  className?: string;
}

export function OfflineBookingForm({
  initialCategory,
  initialServiceId,
  onSuccess,
  className = "",
}: OfflineBookingFormProps) {
  // Category & Service
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "astrology"
  );

  const availableServices = SERVICES.filter(
    (s) => s.categoryId === selectedCategory && s.offlineAvailable !== false
  );

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || (availableServices[0]?.id || "personal-consultation")
  );

  // Sync service selection when category changes
  useEffect(() => {
    const servicesForCat = SERVICES.filter(
      (s) => s.categoryId === selectedCategory && s.offlineAvailable !== false
    );
    if (servicesForCat.length > 0) {
      if (!servicesForCat.find((s) => s.id === selectedServiceId)) {
        setSelectedServiceId(servicesForCat[0].id);
      }
    }
  }, [selectedCategory, selectedServiceId]);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [consultationPreference, setConsultationPreference] = useState<
    "ashram_rishikesh" | "onsite_visit" | "direct_coordination"
  >("ashram_rishikesh");

  // Min date tomorrow
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [preferredDate, setPreferredDate] = useState(getMinDate());
  const [preferredSlot, setPreferredSlot] = useState("Morning (10:00 AM - 01:00 PM)");

  // Birth details
  const [hasBirthDetails, setHasBirthDetails] = useState(
    selectedCategory === "astrology" || selectedCategory === "mantra-diksha"
  );
  const [dateOfBirth, setDateOfBirth] = useState("1995-01-01");
  const [timeOfBirth, setTimeOfBirth] = useState("10:30 AM");
  const [placeOfBirth, setPlaceOfBirth] = useState("");

  const [notes, setNotes] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    inquiryCode: string;
    whatsappUrl: string;
  } | null>(null);

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = "Please enter your full name.";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!whatsappSameAsPhone && (!whatsappNumber.trim() || whatsappNumber.replace(/\D/g, "").length < 10)) {
      errors.whatsappNumber = "Please enter a valid WhatsApp number.";
    }
    if (!city.trim()) {
      errors.city = "Please enter your city/town.";
    }
    if (consultationPreference === "onsite_visit" && !address.trim()) {
      errors.address = "Please provide property address for on-site visit.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const activeService = SERVICES.find((s) => s.id === selectedServiceId);
      const activeCat = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory);

      const prefLabels = {
        ashram_rishikesh: "In-Person Visit to Rishikesh Ashram (Shisham Jhari, Muni Ki Reti)",
        onsite_visit: "On-Site Visit to Client's Premises / Property",
        direct_coordination: "Direct Offline Coordination / Ashram Meeting",
      };

      const payload = {
        serviceId: selectedServiceId,
        serviceCategory: activeCat?.title || selectedCategory,
        serviceTitle: activeService?.title || selectedServiceId,
        fullName,
        phone,
        whatsappNumber: whatsappSameAsPhone ? phone : whatsappNumber,
        email,
        city,
        address: consultationPreference === "onsite_visit" ? address : undefined,
        consultationPreference: prefLabels[consultationPreference],
        preferredDate,
        preferredSlot,
        dateOfBirth: hasBirthDetails ? dateOfBirth : undefined,
        timeOfBirth: hasBirthDetails ? timeOfBirth : undefined,
        placeOfBirth: hasBirthDetails ? placeOfBirth : undefined,
        notes,
      };

      const res = await fetch("/api/offline-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmissionSuccess({
          inquiryCode: data.bookingCode,
          whatsappUrl: data.whatsappUrl,
        });

        if (onSuccess) {
          onSuccess(data.bookingCode, data.whatsappUrl);
        }

        // Try opening WhatsApp directly
        try {
          if (typeof window !== "undefined") {
            window.open(data.whatsappUrl, "_blank");
          }
        } catch {
          // Handled on screen
        }
      } else {
        alert(data.message || "Failed to process offline request. Please contact support.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network error. Please try again or message directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submissionSuccess) {
    return (
      <div className={`bg-white rounded-3xl border border-gold-400/50 p-6 sm:p-10 shadow-xl text-center space-y-6 ${className}`}>
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Inquiry Registered with Ashram
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark">
            Offline Consultation Request Received!
          </h2>
          <p className="text-xs sm:text-sm text-vedic-muted max-w-md mx-auto">
            Your details have been submitted. An inquiry reference has been generated for Guruji&apos;s Rishikesh office:
          </p>
        </div>

        <div className="p-3.5 bg-ivory rounded-2xl border border-border inline-block px-8">
          <span className="text-[11px] text-vedic-muted font-medium block">Offline Inquiry Reference</span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-saffron-700">
            {submissionSuccess.inquiryCode}
          </span>
        </div>

        {/* Next Steps Box */}
        <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/60 text-left space-y-2.5 text-xs sm:text-sm text-amber-950">
          <div className="font-bold text-sm text-vedic-dark flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-saffron-600" />
            <span>How Offline Consultation & Manual Payment Works:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-vedic-muted leading-relaxed pl-1">
            <li>
              <strong className="text-vedic-dark">Forward Details:</strong> Click the green WhatsApp button below to ensure all details are received directly on Admin WhatsApp.
            </li>
            <li>
              <strong className="text-vedic-dark">Slot & Ashram Confirmation:</strong> Our coordinator will verify Guruji&apos;s schedule for your requested date and slot.
            </li>
            <li>
              <strong className="text-vedic-dark">Manual Payment:</strong> The coordinator will share official UPI QR / Bank Account details via WhatsApp to complete your manual booking.
            </li>
            <li>
              <strong className="text-vedic-dark">Confirmation Slip:</strong> Once payment is confirmed, you receive an official ashram pass/appointment slip for your visit.
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={submissionSuccess.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Details on WhatsApp Now</span>
          </a>

          <a
            href={`tel:${SITE_SETTINGS.phone}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ivory hover:bg-ivory-card text-vedic-dark border border-border font-semibold text-sm transition-all"
          >
            <Phone className="w-4 h-4 text-saffron-700" />
            <span>Call Ashram Coordinator</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmissionSuccess(null);
            setFullName("");
            setPhone("");
            setNotes("");
          }}
          className="text-xs text-vedic-muted hover:text-saffron-700 font-medium underline pt-2"
        >
          Book Another Offline Consultation
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-8 lg:p-10 space-y-8 shadow-xs ${className}`}
    >
      {/* Header */}
      <div className="border-b border-border pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
          <Building className="w-3.5 h-3.5" />
          <span>In-Person Ashram & Site Visits</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-vedic-dark">
          Book Offline Consultation
        </h2>
        <p className="text-xs sm:text-sm text-vedic-muted leading-relaxed">
          Fill your details below. Your request will be directly sent to Guruji&apos;s admin on WhatsApp. Payment will be processed manually (UPI/Bank Transfer) upon confirming your appointment slot.
        </p>
      </div>

      {/* 1. Category Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
          1. Select Service Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            { id: "astrology", label: "Astrology", icon: Compass },
            { id: "vastu", label: "Vastu Shastra", icon: Home },
            { id: "puja", label: "Pooja Services", icon: Flame },
            { id: "mantra-diksha", label: "Mantra Diksha", icon: Sparkles },
            { id: "ayurveda", label: "Ayurveda", icon: Leaf },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-saffron-600 bg-saffron-50/80 shadow-xs ring-1 ring-saffron-600/30"
                    : "border-border bg-ivory/60 hover:bg-ivory hover:border-gold-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-saffron-600 text-white" : "bg-white text-vedic-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-semibold ${isSelected ? "text-saffron-800 font-bold" : "text-vedic-dark"}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Specific Service Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
          2. Specific Offering / Puja / Diksha <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm font-semibold text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
        >
          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title} (Starting ₹{service.priceStartingFrom.toLocaleString("en-IN")})
            </option>
          ))}
        </select>
      </div>

      {/* 3. Personal & Contact Details */}
      <div className="space-y-4 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
          3. Your Contact Details <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-vedic-muted block mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
            />
            {formErrors.fullName && (
              <span className="text-[11px] text-red-600 mt-1 block font-medium">
                {formErrors.fullName}
              </span>
            )}
          </div>

          <div>
            <label className="text-xs text-vedic-muted block mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
            />
            {formErrors.phone && (
              <span className="text-[11px] text-red-600 mt-1 block font-medium">
                {formErrors.phone}
              </span>
            )}
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="samePhone"
                checked={whatsappSameAsPhone}
                onChange={(e) => setWhatsappSameAsPhone(e.target.checked)}
                className="rounded border-border text-saffron-600 focus:ring-saffron-500"
              />
              <label htmlFor="samePhone" className="text-xs font-medium text-vedic-dark cursor-pointer">
                WhatsApp number is same as mobile number
              </label>
            </div>

            {!whatsappSameAsPhone && (
              <div>
                <label className="text-xs text-vedic-muted block mb-1">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
                />
                {formErrors.whatsappNumber && (
                  <span className="text-[11px] text-red-600 mt-1 block font-medium">
                    {formErrors.whatsappNumber}
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-vedic-muted block mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
            />
          </div>

          <div>
            <label className="text-xs text-vedic-muted block mb-1">
              City / State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Delhi NCR, Rishikesh, Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
            />
            {formErrors.city && (
              <span className="text-[11px] text-red-600 mt-1 block font-medium">
                {formErrors.city}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Consultation Location Preference */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
          4. Offline Meeting Preference <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "ashram_rishikesh",
              title: "Rishikesh Ashram Visit",
              desc: "In-Person meeting at Shisham Jhari, Muni Ki Reti",
              icon: Building,
            },
            {
              id: "onsite_visit",
              title: "On-Site Property Visit",
              desc: "Guruji / team visits your home, office, or factory",
              icon: MapPin,
            },
            {
              id: "direct_coordination",
              title: "Direct WhatsApp Booking",
              desc: "Coordinate location & timing directly with admin",
              icon: MessageCircle,
            },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = consultationPreference === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => setConsultationPreference(mode.id as any)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-saffron-600 bg-saffron-50/70 shadow-xs ring-1 ring-saffron-600/30"
                    : "border-border bg-ivory/40 hover:bg-ivory"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-saffron-600 text-white" : "bg-white text-vedic-muted"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-vedic-dark">{mode.title}</div>
                    <div className="text-[11px] text-vedic-muted mt-0.5 leading-snug">
                      {mode.desc}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {consultationPreference === "onsite_visit" && (
          <div className="pt-2">
            <label className="text-xs text-vedic-muted block mb-1">
              Property / Site Full Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="House/Plot No., Street, Landmark, City & Pincode"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
            />
            {formErrors.address && (
              <span className="text-[11px] text-red-600 mt-1 block font-medium">
                {formErrors.address}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 5. Preferred Date and Time Slot */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
          5. Preferred Appointment Slot <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-vedic-muted block mb-1">
              Preferred Date
            </label>
            <input
              type="date"
              min={getMinDate()}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
            />
          </div>

          <div>
            <label className="text-xs text-vedic-muted block mb-1">
              Preferred Time Window
            </label>
            <select
              value={preferredSlot}
              onChange={(e) => setPreferredSlot(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
            >
              <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
              <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
              <option value="Evening (05:30 PM - 08:00 PM)">Evening (05:30 PM - 08:00 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. Birth Details (Optional for Vastu/Pooja, Recommended for Astrology/Diksha) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark">
            6. Birth Particulars {selectedCategory === "astrology" && <span className="text-red-500">*</span>}
          </label>
          <button
            type="button"
            onClick={() => setHasBirthDetails(!hasBirthDetails)}
            className="text-[11px] font-semibold text-saffron-700 hover:underline"
          >
            {hasBirthDetails ? "Hide Birth Details" : "+ Add Birth Details"}
          </button>
        </div>

        {hasBirthDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-ivory rounded-2xl border border-border">
            <div>
              <label className="text-xs text-vedic-muted block mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs text-vedic-dark"
              />
            </div>
            <div>
              <label className="text-xs text-vedic-muted block mb-1">Time of Birth</label>
              <input
                type="text"
                placeholder="e.g. 10:30 AM or Unknown"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs text-vedic-dark"
              />
            </div>
            <div>
              <label className="text-xs text-vedic-muted block mb-1">
                Place of Birth {selectedCategory === "astrology" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                placeholder="City, State"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs text-vedic-dark"
              />
              {formErrors.placeOfBirth && (
                <span className="text-[10px] text-red-600 mt-0.5 block font-medium">
                  {formErrors.placeOfBirth}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 7. Query or Specific Requirements */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
          7. Specific Queries / Property Details / Notes
        </label>
        <textarea
          rows={3}
          placeholder="Describe your primary query, property type (for Vastu), spiritual intention (for Diksha), or any specific concerns..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
        />
      </div>

      {/* Manual Payment Notice */}
      <div className="p-4 rounded-2xl bg-saffron-50/60 border border-saffron-200/80 flex items-start gap-3 text-xs text-saffron-900 leading-relaxed">
        <MessageCircle className="w-5 h-5 text-saffron-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Offline Booking & Manual Payment Process:</span>
          <p className="text-vedic-muted mt-0.5">
            Clicking the button below generates your offline inquiry and opens WhatsApp with your pre-filled details. Our ashram administrator will coordinate your slot and share manual payment details (UPI/Bank Transfer).
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
      >
        <MessageCircle className="w-5 h-5" />
        <span>
          {isSubmitting ? "Generating WhatsApp Booking..." : "Submit Details & Book on WhatsApp"}
        </span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </button>

      <div className="text-center text-xs text-vedic-muted">
        Need immediate assistance? Call our Rishikesh ashram at{" "}
        <a href={`tel:${SITE_SETTINGS.phone}`} className="font-semibold text-vedic-dark hover:underline">
          {SITE_SETTINGS.phone}
        </a>
      </div>
    </form>
  );
}
