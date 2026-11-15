"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Compass,
  Home,
  Flame,
  Sparkles,
  Leaf,
  Gem,
  MessageCircle,
  Phone,
  Calendar,
  MapPin,
  Check,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  CreditCard,
  AlertCircle,
  FileText,
  Printer,
  Info,
  Clock,
  ExternalLink,
} from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES } from "@/lib/data/services";
import { SITE_SETTINGS } from "@/lib/constants";
import { loadRazorpayScript, RazorpaySuccessResponse } from "@/lib/razorpay-client";
import {
  OFFLINE_SERVICES_CONFIG,
  OfflineMeetingPreference,
  OfflineLocationType,
  getOfflineServiceConfig,
  getOfflinePricing,
  getOfflineStartingPrice,
} from "@/lib/offline-pricing";

interface OfflineBookingFormProps {
  initialCategory?: string;
  initialServiceId?: string;
  className?: string;
}

export function OfflineBookingForm({
  initialCategory,
  initialServiceId,
  className = "",
}: OfflineBookingFormProps) {
  // Category selection
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "astrology"
  );

  // Available services in current category (excluding dikshas from normal list if mantra-diksha is selected)
  const availableServices = useMemo(() => {
    return SERVICES.filter((s) => {
      if (selectedCategory === "gemstones") {
        return s.categoryId === "gemstones";
      }
      return s.categoryId === selectedCategory && s.offlineAvailable !== false;
    });
  }, [selectedCategory]);

  // Selected Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    if (initialServiceId && OFFLINE_SERVICES_CONFIG[initialServiceId]) {
      return initialServiceId;
    }
    return availableServices[0]?.id || "personal-consultation";
  });

  // Current service config from offline pricing matrix
  const serviceConfig = useMemo(() => {
    return getOfflineServiceConfig(selectedServiceId);
  }, [selectedServiceId]);

  // Meeting preference (Rishikesh office vs On-site)
  const [meetingPreference, setMeetingPreference] =
    useState<OfflineMeetingPreference>("rishikesh_office");

  // Location type for On-site (Rishikesh area vs Outsider)
  const [locationType, setLocationType] =
    useState<OfflineLocationType>("rishikesh_area");

  // Ensure valid meeting preference when service changes
  useEffect(() => {
    if (serviceConfig) {
      if (!serviceConfig.allowedPreferences.includes(meetingPreference)) {
        setMeetingPreference(serviceConfig.allowedPreferences[0]);
      }
    }
  }, [serviceConfig, meetingPreference]);

  // Keep selected service in sync with category
  useEffect(() => {
    if (selectedCategory === "mantra-diksha") {
      setSelectedServiceId("dash-mahavidya-diksha");
      return;
    }
    const matching = SERVICES.filter((s) => {
      if (selectedCategory === "gemstones") return s.categoryId === "gemstones";
      return s.categoryId === selectedCategory && s.offlineAvailable !== false;
    });
    if (matching.length > 0 && !matching.find((s) => s.id === selectedServiceId)) {
      setSelectedServiceId(matching[0].id);
    }
  }, [selectedCategory, selectedServiceId]);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");

  // Min date tomorrow
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [preferredDate, setPreferredDate] = useState(getMinDate());

  // Birth details
  const [hasBirthDetails, setHasBirthDetails] = useState(
    selectedCategory === "astrology"
  );
  const [dateOfBirth, setDateOfBirth] = useState("1995-01-01");
  const [timeOfBirth, setTimeOfBirth] = useState("10:30 AM");
  const [placeOfBirth, setPlaceOfBirth] = useState("");

  const [notes, setNotes] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Confirmed booking state after Razorpay verification
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingCode: string;
    serviceTitle: string;
    meetingPreference: OfflineMeetingPreference;
    locationType?: OfflineLocationType;
    preferredDate: string;
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    propertyAddress?: string;
    totalPrice: number;
    advancePaid: number;
    balanceDue: number;
    requiresHospitality: boolean;
    notice?: string;
    paymentId: string;
  } | null>(null);

  // Dynamic offline pricing calculation
  const currentPricing = useMemo(() => {
    return getOfflinePricing(selectedServiceId, meetingPreference, locationType);
  }, [selectedServiceId, meetingPreference, locationType]);

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = "Please enter your full name.";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (
      !whatsappSameAsPhone &&
      (!whatsappNumber.trim() || whatsappNumber.replace(/\D/g, "").length < 10)
    ) {
      errors.whatsappNumber = "Please enter a valid WhatsApp number.";
    }
    if (!city.trim()) {
      errors.city = "Please enter your city / state.";
    }
    if (meetingPreference === "onsite_visit" && !propertyAddress.trim()) {
      errors.propertyAddress =
        "Please provide the complete property / site address for the on-site visit.";
    }
    if (!preferredDate) {
      errors.preferredDate = "Please choose a preferred appointment date.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Online 50% Advance Payment execution via Razorpay Checkout
  const handleAdvancePayment = async () => {
    if (!validateForm()) {
      // Smooth scroll to first error
      const firstErr = document.querySelector(".text-red-600");
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!currentPricing || currentPricing.advanceAmount <= 0) {
      alert("Unable to calculate consultation fee. Please choose a valid service option.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // 1. Safely load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert(
          "Unable to load secure Razorpay payment gateway. Please check your internet connection."
        );
        setIsProcessingPayment(false);
        return;
      }

      // 2. Format customer details
      const customerDetails = {
        fullName: fullName.trim(),
        email: email.trim() || `${phone.trim()}@astroraj.org`,
        phone: phone.trim(),
        whatsappSameAsPhone,
        whatsappNumber: whatsappSameAsPhone ? phone.trim() : whatsappNumber.trim(),
        placeOfBirth: placeOfBirth.trim() || city.trim(),
        dateOfBirth: hasBirthDetails ? dateOfBirth : "N/A",
        timeOfBirth: hasBirthDetails ? timeOfBirth : "N/A",
        questionOrNotes: [
          `[OFFLINE CONSULTATION - 50% ADVANCE BOOKING]`,
          `Meeting Format: ${
            meetingPreference === "rishikesh_office"
              ? "Rishikesh Office Visit"
              : `On-Site Visit (${locationType === "outsider" ? "Outsider" : "Rishikesh Area"})`
          }`,
          `Total Fee: ₹${currentPricing.totalPrice.toLocaleString("en-IN")}`,
          `Advance Paid: ₹${currentPricing.advanceAmount.toLocaleString("en-IN")}`,
          `Balance Due On-Site: ₹${currentPricing.balanceAmount.toLocaleString("en-IN")}`,
          meetingPreference === "onsite_visit" ? `Site Address: ${propertyAddress}` : null,
          currentPricing.requiresHospitality
            ? "Notice: Food & Accommodation by customer"
            : null,
          currentPricing.notice ? `Notice: ${currentPricing.notice}` : null,
          notes ? `Client Queries: ${notes}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
      };

      // 3. Create server-side order with verified 50% advance price
      const createOrderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          bookingMode: "offline",
          serviceId: selectedServiceId,
          offlinePreference: meetingPreference,
          offlineLocation: locationType,
          propertyAddress: meetingPreference === "onsite_visit" ? propertyAddress : undefined,
          date: preferredDate,
          timeSlot: "Confirmed Day Appointment",
          customerDetails,
        }),
      });

      const orderData = await createOrderRes.json();
      if (!createOrderRes.ok || !orderData.success) {
        alert(orderData.message || "Failed to create payment order. Please try again.");
        setIsProcessingPayment(false);
        return;
      }

      // 4. Open Razorpay Standard Checkout Popup
      const options = {
        key: orderData.keyId,
        amount: orderData.amount, // 50% advance amount in paise
        currency: orderData.currency || "INR",
        name: SITE_SETTINGS.brandName || "Astro Raj",
        description: `50% Advance: ${currentPricing.serviceTitle} (${
          meetingPreference === "rishikesh_office" ? "Office Visit" : "On-Site"
        })`,
        image: "/favicon.ico",
        order_id: orderData.orderId,
        prefill: {
          name: fullName,
          email: email || undefined,
          contact: phone,
        },
        notes: {
          bookingCode: orderData.bookingCode,
          serviceId: selectedServiceId,
          meetingPreference,
          totalPrice: String(currentPricing.totalPrice),
          advancePaid: String(currentPricing.advanceAmount),
          balanceDue: String(currentPricing.balanceAmount),
        },
        theme: {
          color: "#d05e2d", // Vedic Saffron
        },
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            // 5. Server-side HMAC SHA256 Signature Verification
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                entityType: "booking",
                entityId: orderData.bookingCode,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setConfirmedBooking({
                bookingCode: orderData.bookingCode,
                serviceTitle: currentPricing.serviceTitle,
                meetingPreference,
                locationType: meetingPreference === "onsite_visit" ? locationType : undefined,
                preferredDate,
                fullName,
                phone,
                email,
                city,
                propertyAddress:
                  meetingPreference === "onsite_visit" ? propertyAddress : undefined,
                totalPrice: currentPricing.totalPrice,
                advancePaid: currentPricing.advanceAmount,
                balanceDue: currentPricing.balanceAmount,
                requiresHospitality: currentPricing.requiresHospitality,
                notice: currentPricing.notice,
                paymentId: response.razorpay_payment_id,
              });

              // Celebration confetti
              confetti({
                particleCount: 90,
                spread: 70,
                origin: { y: 0.6 },
              });

              // Scroll to top
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            } else {
              alert(
                verifyData.message ||
                  "Payment verification pending. Our team will verify and confirm your offline booking shortly."
              );
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            alert("Payment processed, but network interrupted. Please contact our ashram with your payment receipt.");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      alert("An unexpected error occurred while initiating payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  // Format chosen date into human-friendly day string
  const formattedDayString = useMemo(() => {
    if (!preferredDate) return "";
    try {
      const d = new Date(preferredDate);
      return d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return preferredDate;
    }
  }, [preferredDate]);

  // =========================================================================
  // VIEW 1: SUCCESS CONFIRMATION SCREEN (POST 50% PAYMENT)
  // =========================================================================
  if (confirmedBooking) {
    const waBookingMsg = [
      `*Hari Om Guruji! My Offline Consultation is Booked*`,
      `----------------------------------------`,
      `*Booking Code:* ${confirmedBooking.bookingCode}`,
      `*Service:* ${confirmedBooking.serviceTitle}`,
      `*Client Name:* ${confirmedBooking.fullName}`,
      `*Mobile Number:* ${confirmedBooking.phone}`,
      `*Scheduled Day:* ${confirmedBooking.preferredDate}`,
      `*Format:* ${
        confirmedBooking.meetingPreference === "rishikesh_office"
          ? "Rishikesh Office Visit"
          : `On-Site Visit (${
              confirmedBooking.locationType === "outsider" ? "Outside Rishikesh" : "Rishikesh Area"
            })`
      }`,
      confirmedBooking.propertyAddress
        ? `*Property Address:* ${confirmedBooking.propertyAddress}`
        : null,
      `*Total Consultation Fee:* ₹${confirmedBooking.totalPrice.toLocaleString("en-IN")}`,
      `*Advance Paid Online (50%):* ₹${confirmedBooking.advancePaid.toLocaleString("en-IN")} (Razorpay ID: ${confirmedBooking.paymentId})`,
      `*Balance Payable On-Site (50%):* ₹${confirmedBooking.balanceDue.toLocaleString("en-IN")}`,
      confirmedBooking.requiresHospitality
        ? `*Note:* Khana & Rehna arranged by client`
        : null,
      `----------------------------------------`,
      `_Please confirm my scheduled visiting hours and share visit guidelines._`,
    ]
      .filter(Boolean)
      .join("\n");

    const waConfirmUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
      waBookingMsg
    )}`;

    return (
      <div
        className={`bg-white rounded-3xl border border-gold-400/60 p-5 sm:p-8 md:p-10 shadow-2xl text-center space-y-7 max-w-3xl mx-auto ${className}`}
      >
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/60 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            50% Advance Payment Verified & Confirmed
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark">
            Offline Consultation Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-vedic-muted max-w-lg mx-auto leading-relaxed">
            Your appointment has been registered with Astrologer Rajat Thakur&apos;s Rishikesh office. Your 50% advance has been secured online.
          </p>
        </div>

        {/* Booking Reference Code */}
        <div className="p-4 bg-gradient-to-r from-amber-50/60 via-ivory to-amber-50/60 rounded-2xl border border-gold-400/40 inline-block px-8 shadow-xs">
          <span className="text-[11px] text-vedic-muted font-semibold uppercase tracking-wider block">
            Official Booking Reference Pass
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-saffron-700 tracking-wide">
            {confirmedBooking.bookingCode}
          </span>
        </div>

        {/* Financial & Schedule Breakdown Card */}
        <div className="bg-ivory rounded-2xl p-5 sm:p-6 border border-border text-left space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-vedic-dark border-b border-border/80 pb-2 flex items-center justify-between">
            <span>Booking & Payment Summary</span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px] normal-case font-semibold">
              Payment ID: {confirmedBooking.paymentId.slice(-8)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-vedic-muted text-xs block">Consultation Offering</span>
              <strong className="text-vedic-dark font-serif text-sm block mt-0.5">
                {confirmedBooking.serviceTitle}
              </strong>
            </div>

            <div>
              <span className="text-vedic-muted text-xs block">Scheduled Appointment Day</span>
              <strong className="text-vedic-dark font-semibold text-sm flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-saffron-600" />
                {formattedDayString || confirmedBooking.preferredDate}
              </strong>
            </div>

            <div>
              <span className="text-vedic-muted text-xs block">Offline Meeting Format</span>
              <strong className="text-vedic-dark font-semibold block mt-0.5">
                {confirmedBooking.meetingPreference === "rishikesh_office"
                  ? "Rishikesh Office Visit"
                  : `On-Site Visit (${
                      confirmedBooking.locationType === "outsider"
                        ? "Outside Rishikesh"
                        : "Rishikesh Area"
                    })`}
              </strong>
            </div>

            <div>
              <span className="text-vedic-muted text-xs block">Client Contact</span>
              <span className="text-vedic-dark font-medium block mt-0.5">
                {confirmedBooking.fullName} • {confirmedBooking.phone}
              </span>
            </div>
          </div>

          {confirmedBooking.meetingPreference === "rishikesh_office" ? (
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-saffron-700 shrink-0 mt-0.5" />
              <div>
                <strong>Rishikesh Office Address:</strong> {SITE_SETTINGS.address}
              </div>
            </div>
          ) : (
            confirmedBooking.propertyAddress && (
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-saffron-700 shrink-0 mt-0.5" />
                <div>
                  <strong>On-Site Property Address:</strong> {confirmedBooking.propertyAddress}
                </div>
              </div>
            )
          )}

          {/* Pricing Row */}
          <div className="pt-3 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white border border-border">
              <span className="text-[11px] text-vedic-muted block">Total Consultation Fee</span>
              <span className="text-base font-bold text-vedic-dark">
                ₹{confirmedBooking.totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900">
              <span className="text-[11px] text-emerald-700 font-semibold block">
                50% Advance Paid Online
              </span>
              <span className="text-base font-bold text-emerald-700">
                ₹{confirmedBooking.advancePaid.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950">
              <span className="text-[11px] text-amber-800 font-semibold block">
                50% Balance (Pay on Site)
              </span>
              <span className="text-base font-bold text-saffron-800">
                ₹{confirmedBooking.balanceDue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {confirmedBooking.requiresHospitality && (
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-center gap-2">
              <Info className="w-4 h-4 text-orange-600 shrink-0" />
              <span>
                <strong>Hospitality Note:</strong> As agreed, travel boarding & lodging (Khana & Rehna) is to be arranged by the client for this outside visit.
              </span>
            </div>
          )}

          {confirmedBooking.notice && (
            <div className="p-3 rounded-xl bg-saffron-50 border border-saffron-200 text-xs text-saffron-950 flex items-center gap-2">
              <Info className="w-4 h-4 text-saffron-600 shrink-0" />
              <span>{confirmedBooking.notice}</span>
            </div>
          )}
        </div>

        {/* What Happens Next */}
        <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-200/50 text-left space-y-2.5 text-xs sm:text-sm text-amber-950">
          <div className="font-bold text-sm text-vedic-dark flex items-center gap-2">
            <Check className="w-4 h-4 text-saffron-600" />
            <span>Next Steps for Your In-Person Session:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-vedic-muted leading-relaxed pl-1">
            <li>
              <strong className="text-vedic-dark">Ashram Schedule Confirmation:</strong> Our ashram coordinator will call you within a few hours to confirm the exact visiting hours for your scheduled day.
            </li>
            <li>
              <strong className="text-vedic-dark">Forward Pass on WhatsApp:</strong> Click the green WhatsApp button below to ensure your booking pass is directly linked in our coordinator&apos;s records.
            </li>
            <li>
              <strong className="text-vedic-dark">Remaining 50% Balance:</strong> To be settled directly at our Rishikesh office or at your property upon arrival.
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={waConfirmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Confirmation to Ashram WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ivory hover:bg-ivory-card text-vedic-dark border border-border font-semibold text-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-saffron-700" />
            <span>Print Appointment Pass</span>
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setConfirmedBooking(null);
              setFullName("");
              setPhone("");
              setNotes("");
            }}
            className="text-xs text-vedic-muted hover:text-saffron-700 font-medium underline pt-2 cursor-pointer"
          >
            Book Another Consultation
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: MANTRA DIKSHA DIRECT GURUJI CONTACT CARD
  // =========================================================================
  if (selectedCategory === "mantra-diksha") {
    const waMantraUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
      "Hari Om Guruji! I would like to seek your divine guidance and receive authentic Gurumukhi initiation for Mantra Diksha & Sadhana."
    )}`;

    return (
      <div
        className={`bg-white rounded-2xl sm:rounded-3xl border border-gold-400/50 p-5 sm:p-8 lg:p-10 space-y-7 shadow-xl ${className}`}
      >
        {/* Category Tabs Header */}
        {renderCategoryTabs()}

        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50/80 via-ivory to-orange-50/70 border border-gold-400/60 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-800 bg-saffron-100/80 px-3.5 py-1 rounded-full inline-block">
              Gurumukhi Vidhi • Sacred Initiation Lineage
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark">
              Mantra Diksha & Sacred Sadhana
            </h3>
            <p className="text-xs sm:text-sm text-vedic-muted leading-relaxed">
              मंत्र दीक्षा एवं साधना की सभी 7 विधियों के लिए पूज्य गुरुजी से सीधे संपर्क करें। गुरुमुख से संकल्प व गोपनीय साधना विधि प्राप्त करने हेतु व्यक्तिगत मार्गदर्शन अनिवार्य है।
            </p>
          </div>

          {/* List of 7 Sacred Dikshas */}
          <div className="bg-white rounded-2xl p-5 border border-gold-300/40 text-left max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-vedic-dark uppercase tracking-wide block border-b border-border pb-1.5">
              Available 7 Sacred Gurumukhi Dikshas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-vedic-dark font-medium">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-600 shrink-0" />
                <span>Dash Mahavidya Diksha & Sadhana</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-600 shrink-0" />
                <span>Asht Bhairav Diksha & Raksha Vidhi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-600 shrink-0" />
                <span>Swarnakarshan Bhairav Maha Diksha</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-600 shrink-0" />
                <span>Lord Shiv Diksha (Mahamrityunjaya)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-600 shrink-0" />
                <span>Lord Ganesh Diksha (Haridra & Uchchhishta)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-600 shrink-0" />
                <span>Lord Narayan Diksha (Narayana Kavach)</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-600 shrink-0" />
                <span>Lord Sudarshan Chakra Maha Diksha</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={waMantraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Guruji Directly on WhatsApp</span>
            </a>

            <a
              href={`tel:${SITE_SETTINGS.phone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-ivory text-vedic-dark border border-border font-bold text-sm transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-saffron-700" />
              <span>Call Rishikesh Ashram ({SITE_SETTINGS.phone})</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: MAIN OFFLINE CONSULTATION BOOKING FORM (WITH 50% ADVANCE PAYMENT)
  // =========================================================================
  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl border border-gold-400/50 p-4 sm:p-8 lg:p-10 space-y-8 shadow-xl ${className}`}
    >
      {/* Header */}
      <div className="border-b border-border pb-5 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200/60 text-saffron-800 text-xs font-semibold uppercase tracking-wider">
          <Building className="w-3.5 h-3.5 text-saffron-700" />
          <span>In-Person Office & On-Site Visits • 50% Advance Booking</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark">
          Book Offline Consultation
        </h2>
        <p className="text-xs sm:text-sm text-vedic-muted leading-relaxed max-w-2xl">
          Meet Guruji in person at our Rishikesh office or invite our learned Vedic team for an on-site property evaluation / puja. Pay 50% advance online to secure your appointment slot, and settle the remaining 50% on-site.
        </p>
      </div>

      {/* 1. Category Selection Tabs */}
      {renderCategoryTabs()}

      {/* 2. Specific Service Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
          2. Specific Offering / Puja / Consultation <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm font-semibold text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500 shadow-xs"
        >
          {availableServices.map((service) => {
            const startPrice = getOfflineStartingPrice(service.id);
            return (
              <option key={service.id} value={service.id}>
                {service.title} {startPrice > 0 ? `(From ₹${startPrice.toLocaleString("en-IN")})` : ""}
              </option>
            );
          })}
        </select>

        {/* Pooja Services Notification */}
        {selectedCategory === "puja" && (
          <div className="mt-2 p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
            <Flame className="w-4 h-4 text-saffron-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-vedic-dark font-semibold">विशेष सूचना:</strong> इस पूजा अनुष्ठान हेतु गुरुजी द्वारा प्रशिक्षित योग्य वैदिक पंडितजी को आपके स्थान पर भेजा जाएगा। पूज्य गुरुजी से स्वयं पूजा कराने के लिए{" "}
              <a
                href={`https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
                  "Hari Om Guruji! I would like to inquire about booking a puja directly performed by you personally."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron-700 underline font-bold inline-flex items-center gap-0.5 hover:text-saffron-800"
              >
                कृपया व्यक्तिगत संपर्क करें <ExternalLink className="w-3 h-3 inline" />
              </a>
              ।
            </div>
          </div>
        )}
      </div>

      {/* 3. Offline Meeting Preference (ONLY 2 OPTIONS: Rishikesh Office vs On-Site Visit) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
            3. Offline Meeting Preference <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] font-semibold text-saffron-700">
            50% Advance Online • 50% On-Site
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Option 1: Rishikesh Office Visit */}
          {(() => {
            const isOfficeAllowed = serviceConfig?.allowedPreferences.includes("rishikesh_office");
            const isSelected = meetingPreference === "rishikesh_office" && isOfficeAllowed;
            const officePrice = serviceConfig?.officePrice;

            return (
              <div
                onClick={() => {
                  if (isOfficeAllowed) setMeetingPreference("rishikesh_office");
                }}
                className={`p-4 rounded-2xl border transition-all relative ${
                  !isOfficeAllowed
                    ? "opacity-50 bg-gray-50 border-gray-200 cursor-not-allowed"
                    : isSelected
                    ? "border-saffron-600 bg-saffron-50/70 shadow-sm ring-2 ring-saffron-500/30 cursor-pointer"
                    : "border-border bg-ivory/40 hover:bg-ivory hover:border-gold-400 cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-saffron-600 text-white"
                        : isOfficeAllowed
                        ? "bg-white text-vedic-dark border border-border"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Building className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-vedic-dark">
                        Rishikesh Office Visit
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-saffron-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-vedic-muted mt-0.5 leading-snug">
                      In-person meeting at Shisham Jhari, Muni Ki Reti, Rishikesh
                    </p>

                    {isOfficeAllowed && officePrice ? (
                      <div className="mt-2 text-xs font-semibold text-saffron-800">
                        ₹{officePrice.toLocaleString("en-IN")}{" "}
                        <span className="text-[11px] font-normal text-vedic-muted">
                          (₹{Math.round(officePrice / 2).toLocaleString("en-IN")} Advance)
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-red-600 mt-1 block font-medium">
                        Not applicable for this service (Requires on-site visit)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Option 2: On-Site Property / Venue Visit */}
          {(() => {
            const isOnSiteAllowed = serviceConfig?.allowedPreferences.includes("onsite_visit");
            const isSelected = meetingPreference === "onsite_visit" && isOnSiteAllowed;

            return (
              <div
                onClick={() => {
                  if (isOnSiteAllowed) setMeetingPreference("onsite_visit");
                }}
                className={`p-4 rounded-2xl border transition-all relative ${
                  !isOnSiteAllowed
                    ? "opacity-50 bg-gray-50 border-gray-200 cursor-not-allowed"
                    : isSelected
                    ? "border-saffron-600 bg-saffron-50/70 shadow-sm ring-2 ring-saffron-500/30 cursor-pointer"
                    : "border-border bg-ivory/40 hover:bg-ivory hover:border-gold-400 cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-saffron-600 text-white"
                        : isOnSiteAllowed
                        ? "bg-white text-vedic-dark border border-border"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-vedic-dark">
                        On-Site Visit (Your Property)
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-saffron-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-vedic-muted mt-0.5 leading-snug">
                      Guruji / learned team visits your home, office, factory or venue
                    </p>

                    {isOnSiteAllowed ? (
                      <div className="mt-2 text-xs font-semibold text-saffron-800">
                        {serviceConfig?.onsiteRishikeshPrice && (
                          <span>
                            From ₹{serviceConfig.onsiteRishikeshPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="text-[11px] font-normal text-vedic-muted ml-1">
                          (Rishikesh Area & Outside)
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-red-600 mt-1 block font-medium">
                        Only available as Rishikesh Office Visit
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* If On-Site Visit is selected: Choose Rishikesh Area vs Outsider */}
        {meetingPreference === "onsite_visit" && (
          <div className="mt-3 p-4 bg-ivory rounded-2xl border border-border space-y-4">
            <label className="text-xs font-bold text-vedic-dark block">
              Choose On-Site Visit Location Category <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Rishikesh Area */}
              <div
                onClick={() => setLocationType("rishikesh_area")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  locationType === "rishikesh_area"
                    ? "border-saffron-600 bg-white ring-2 ring-saffron-500/20 shadow-xs"
                    : "border-border bg-white/70 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-vedic-dark">
                    Rishikesh Local Area
                  </span>
                  {locationType === "rishikesh_area" && (
                    <span className="text-xs text-saffron-700 font-bold">Selected</span>
                  )}
                </div>
                <div className="text-xs text-vedic-muted mt-1">
                  Properties within Rishikesh & adjacent areas
                </div>
                {serviceConfig?.onsiteRishikeshPrice && (
                  <div className="mt-2 text-xs font-bold text-vedic-dark">
                    Fee: ₹{serviceConfig.onsiteRishikeshPrice.toLocaleString("en-IN")}{" "}
                    <span className="text-saffron-700 font-semibold text-[11px]">
                      (₹{Math.round(serviceConfig.onsiteRishikeshPrice / 2).toLocaleString("en-IN")} Advance)
                    </span>
                  </div>
                )}
              </div>

              {/* Outside Rishikesh (Outsider) */}
              <div
                onClick={() => setLocationType("outsider")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  locationType === "outsider"
                    ? "border-saffron-600 bg-white ring-2 ring-saffron-500/20 shadow-xs"
                    : "border-border bg-white/70 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-vedic-dark">
                    Outsider (Outside Rishikesh / Pan-India)
                  </span>
                  {locationType === "outsider" && (
                    <span className="text-xs text-saffron-700 font-bold">Selected</span>
                  )}
                </div>
                <div className="text-xs text-vedic-muted mt-1">
                  Delhi-NCR, Mumbai, other states & international
                </div>
                {serviceConfig?.onsiteOutsiderPrice && (
                  <div className="mt-2 text-xs font-bold text-vedic-dark">
                    Fee: ₹{serviceConfig.onsiteOutsiderPrice.toLocaleString("en-IN")}{" "}
                    <span className="text-saffron-700 font-semibold text-[11px]">
                      (₹{Math.round(serviceConfig.onsiteOutsiderPrice / 2).toLocaleString("en-IN")} Advance)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Crucial Hospitality Alert for Outsider */}
            {locationType === "outsider" && (
              <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-300 text-xs text-orange-950 flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-orange-900 block">
                    + Khana and Rehna (Food & Accommodation) Note:
                  </strong>
                  For on-site visits outside Rishikesh, all hospitality including hygienic boarding, lodging, and local transit shall be arranged directly by the customer.
                </div>
              </div>
            )}

            {/* Property / Site Full Address */}
            <div className="pt-1">
              <label className="text-xs text-vedic-muted block mb-1">
                Property / Venue Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="House/Plot/Office No., Street, Landmark, City & Pincode"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500 bg-white"
              />
              {formErrors.propertyAddress && (
                <span className="text-[11px] text-red-600 mt-1 block font-medium">
                  {formErrors.propertyAddress}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Personal & Contact Details */}
      <div className="space-y-4 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
          4. Your Contact Details <span className="text-red-500">*</span>
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
                className="rounded border-border text-saffron-600 focus:ring-saffron-500 cursor-pointer"
              />
              <label
                htmlFor="samePhone"
                className="text-xs font-medium text-vedic-dark cursor-pointer select-none"
              >
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
              Email Address (For Booking Pass & Invoice)
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
              placeholder="e.g. Rishikesh, Delhi NCR, Dehradun"
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

      {/* 5. Preferred Appointment Slot (ONLY DAY / DATE - NO TIME DURATION PER SPEC) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
            5. Preferred Appointment Day <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-vedic-muted">
            (Exact visit hours coordinated via phone)
          </span>
        </div>

        <div className="p-4 bg-ivory rounded-2xl border border-border space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs text-vedic-muted block mb-1">
                Select Preferred Date
              </label>
              <input
                type="date"
                min={getMinDate()}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border text-base sm:text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500 bg-white"
              />
              {formErrors.preferredDate && (
                <span className="text-[11px] text-red-600 mt-1 block font-medium">
                  {formErrors.preferredDate}
                </span>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-border/80">
              <span className="text-[11px] text-vedic-muted block">Selected Appointment Day:</span>
              <strong className="text-sm font-semibold text-vedic-dark flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-saffron-600" />
                {formattedDayString || "Please pick a date"}
              </strong>
            </div>
          </div>

          <p className="text-[11px] text-vedic-muted flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-saffron-700 shrink-0" />
            <span>
              Note: Offline visits do not have rigid time duration windows. Our coordinator connects with you on the chosen day to coordinate exact arrival and visiting hours.
            </span>
          </p>
        </div>
      </div>

      {/* 6. Birth Details (Optional for Vastu/Pooja, Recommended for Astrology) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark">
            6. Birth Particulars {selectedCategory === "astrology" && "(Recommended)"}
          </label>
          <button
            type="button"
            onClick={() => setHasBirthDetails(!hasBirthDetails)}
            className="text-[11px] font-semibold text-saffron-700 hover:underline cursor-pointer"
          >
            {hasBirthDetails ? "Hide Birth Details" : "+ Add Birth Particulars"}
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
              <label className="text-xs text-vedic-muted block mb-1">Place of Birth</label>
              <input
                type="text"
                placeholder="City, State"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs text-vedic-dark"
              />
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
          placeholder="Describe your primary query, property area/type (for Vastu), puja sankalp wish, or any special requirements..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
        />
      </div>

      {/* 8. 50-50 Payment Breakdown Card */}
      {currentPricing && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 via-ivory to-orange-50/80 border border-gold-400/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gold-300/40 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-vedic-dark flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-saffron-700" />
              Offline Consultation Fee Summary
            </span>
            <span className="text-[11px] font-bold text-saffron-800 bg-saffron-100/90 px-2.5 py-0.5 rounded-full">
              50% Advance Online
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between items-center text-vedic-muted">
              <span>Service Offering:</span>
              <span className="font-semibold text-vedic-dark text-right">
                {currentPricing.serviceTitle}
              </span>
            </div>

            <div className="flex justify-between items-center text-vedic-muted">
              <span>Selected Format:</span>
              <span className="font-semibold text-vedic-dark text-right">
                {meetingPreference === "rishikesh_office"
                  ? "Rishikesh Office Visit"
                  : `On-Site Visit (${
                      locationType === "outsider" ? "Outside Rishikesh" : "Rishikesh Area"
                    })`}
              </span>
            </div>

            <div className="flex justify-between items-center text-vedic-muted pt-1">
              <span>Total Consultation Fee:</span>
              <span className="font-bold text-base text-vedic-dark">
                ₹{currentPricing.totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="h-px bg-gold-300/50 my-2" />

            <div className="flex justify-between items-center py-1 bg-white/70 px-3 rounded-lg border border-gold-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-900 text-xs sm:text-sm">
                  Advance Payment (50% Online Now):
                </span>
              </div>
              <span className="font-extrabold text-base sm:text-lg text-emerald-700">
                ₹{currentPricing.advanceAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 bg-white/70 px-3 rounded-lg border border-gold-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-saffron-600 shrink-0" />
                <span className="font-medium text-amber-950 text-xs sm:text-sm">
                  Remaining Balance (50% Pay on Site):
                </span>
              </div>
              <span className="font-bold text-base text-saffron-800">
                ₹{currentPricing.balanceAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {currentPricing.hospitalityText && (
            <div className="text-[11px] text-orange-900 bg-orange-100/60 p-2.5 rounded-lg border border-orange-200/80 leading-snug">
              ⚠️ <strong>Notice:</strong> {currentPricing.hospitalityText}
            </div>
          )}

          {currentPricing.notice && (
            <div className="text-[11px] text-saffron-900 bg-saffron-100/60 p-2.5 rounded-lg border border-saffron-200/80 leading-snug">
              ℹ️ <strong>Puja Vidhi Notice:</strong> {currentPricing.notice}
            </div>
          )}
        </div>
      )}

      {/* 9. Action Button & Security Assurance */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleAdvancePayment}
          disabled={isProcessingPayment || !currentPricing || currentPricing.advanceAmount <= 0}
          className="w-full py-4 px-6 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-5 h-5" />
          <span>
            {isProcessingPayment
              ? "Opening Secure Razorpay Gateway..."
              : `Pay ₹${
                  currentPricing?.advanceAmount
                    ? currentPricing.advanceAmount.toLocaleString("en-IN")
                    : "0"
                } (50% Advance Online) & Confirm Booking`}
          </span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-center text-xs text-vedic-muted">
          <div className="flex items-center justify-center gap-1.5 p-2 bg-ivory rounded-lg border border-border">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Secure Checkout (Razorpay)</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 p-2 bg-ivory rounded-lg border border-border">
            <FileText className="w-4 h-4 text-saffron-600 shrink-0" />
            <span>Instant Official Pass & Receipt</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 p-2 bg-ivory rounded-lg border border-border">
            <Phone className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Dedicated Ashram Coordinator</span>
          </div>
        </div>

        <div className="text-center text-xs text-vedic-muted pt-1">
          Need immediate consultation assistance? Call our Rishikesh ashram at{" "}
          <a
            href={`tel:${SITE_SETTINGS.phone}`}
            className="font-bold text-vedic-dark hover:underline"
          >
            {SITE_SETTINGS.phone}
          </a>
        </div>
      </div>
    </div>
  );

  // Helper renderer for category tabs
  function renderCategoryTabs() {
    return (
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-vedic-dark block">
          1. Select Service Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { id: "astrology", label: "Astrology", icon: Compass },
            { id: "vastu", label: "Vastu Shastra", icon: Home },
            { id: "puja", label: "Pooja Services", icon: Flame },
            { id: "mantra-diksha", label: "Mantra Diksha", icon: Sparkles },
            { id: "ayurveda", label: "Ayurveda", icon: Leaf },
            { id: "gemstones", label: "Gemstones", icon: Gem },
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
                    ? "border-saffron-600 bg-saffron-50/80 shadow-xs ring-2 ring-saffron-600/30 font-bold"
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
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? "text-saffron-800 font-bold" : "text-vedic-dark"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
