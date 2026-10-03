"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MessageCircle,
  Sparkles,
  Award,
  Video,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Course } from "@/lib/types";
import { SITE_SETTINGS } from "@/lib/constants";
import { loadRazorpayScript, RazorpaySuccessResponse } from "@/lib/razorpay-client";

interface CourseEnrollModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CourseEnrollModal({ course, isOpen, onClose }: CourseEnrollModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [enrollmentCode, setEnrollmentCode] = useState("");

  if (!isOpen || !course) return null;

  const discountPercent = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100
  );

  const whatsappMessage = encodeURIComponent(
    `Jai Guru Ji! I want to enroll in the "${course.title}". My Name: ${fullName || "[Your Name]"}, Email: ${email || "[Your Email]"}, Phone: ${phone || "[Your Phone]"}. Please share enrollment & payment details.`
  );
  const whatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${whatsappMessage}`;

  const handleOnlinePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address for course access.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit WhatsApp phone number.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on server
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consultation", // Razorpay order backend supports consultation/shop payload
          serviceId: course.id,
          serviceTitle: course.title,
          price: course.price,
          customerDetails: {
            fullName,
            email,
            phone,
            questionOrNotes: `Course Enrollment: ${course.title}. Notes: ${notes}`,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate online enrollment.");
      }

      // Check if simulated demo mode
      if (data.simulated) {
        setEnrollmentCode(data.orderId || `AR-CRS-${Math.floor(1000 + Math.random() * 9000)}`);
        setIsSuccess(true);
        setIsProcessing(false);
        return;
      }

      // 2. Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay checkout failed to load. Please check your internet connection.");
      }

      // 3. Open Razorpay Checkout modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Astro Raj Academy",
        description: `Enrollment: ${course.title}`,
        image: "https://darkcyan-marten-836084.hostingersite.com/wp-content/uploads/2025/09/Group-1000005273.png",
        order_id: data.orderId,
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#b43b22", // Vedic Saffron
        },
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                type: "consultation",
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setEnrollmentCode(response.razorpay_payment_id || `ENR-${Date.now()}`);
              setIsSuccess(true);
            } else {
              setErrorMessage("Payment verification failed. Please contact support.");
            }
          } catch {
            setErrorMessage("Error confirming enrollment. Please contact our support team.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again or enroll via WhatsApp.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-border overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-vedic-dark via-vedic-brown to-vedic-dark p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast-Track Admission</span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold pr-8 leading-snug">
            {course.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-100/90 mt-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>{course.duration}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-gold-400" />
              <span>{course.mode}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-300">
              <Award className="w-3.5 h-3.5" />
              <span>Ashram Certificate</span>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-vedic-dark">
                Congratulations & Welcome to the Academy!
              </h3>
              <p className="text-sm text-vedic-muted max-w-md mx-auto">
                Your admission to <strong className="text-vedic-dark">{course.title}</strong> has been received successfully.
              </p>
              <div className="bg-ivory p-4 rounded-2xl border border-border inline-block text-left text-xs space-y-1">
                <div>
                  <span className="text-vedic-muted">Enrollment Reference:</span>{" "}
                  <strong className="text-saffron-700">{enrollmentCode}</strong>
                </div>
                <div>
                  <span className="text-vedic-muted">Student Name:</span>{" "}
                  <strong className="text-vedic-dark">{fullName}</strong>
                </div>
                <div>
                  <span className="text-vedic-muted">Access Details:</span> Sent to{" "}
                  <strong className="text-vedic-dark">{email}</strong>
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Join Student WhatsApp Group</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-ivory hover:bg-ivory-card border border-border text-vedic-dark rounded-xl text-xs font-semibold"
                >
                  Close & Explore Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Enrollment Form */
            <form onSubmit={handleOnlinePayment} className="space-y-6">
              {/* Fee & Discount Summary */}
              <div className="bg-gradient-to-br from-amber-50/80 to-saffron-50/40 p-4 rounded-2xl border border-saffron-200/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-saffron-900">Total Course Fee</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-serif text-2xl font-bold text-saffron-700">
                      ₹{course.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-vedic-muted line-through">
                      ₹{course.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {discountPercent}% OFF
                    </span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-vedic-muted">
                  <div className="text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Includes All Taxes</span>
                  </div>
                  <span>Lifetime Access Included</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-vedic-muted">
                  Student Information
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-vedic-dark mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:border-saffron-600 bg-ivory/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-vedic-dark mb-1">
                      Email Address (for Course Portal) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:border-saffron-600 bg-ivory/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-vedic-dark mb-1">
                      WhatsApp Number (for Cohort Access) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-vedic-dark focus:outline-hidden focus:border-saffron-600 bg-ivory/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-vedic-dark mb-1">
                    Any Questions or Prior Astrology Background? (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us if you are a beginner or have read charts before..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border text-xs text-vedic-dark focus:outline-hidden focus:border-saffron-600 bg-ivory/50"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-saffron-600 via-saffron-700 to-saffron-800 hover:from-saffron-700 hover:to-saffron-900 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-gold-300" />
                  <span>
                    {isProcessing ? "Connecting to Payment Gateway..." : `Pay ₹${course.price.toLocaleString("en-IN")} & Enroll Instantly`}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center">
                  <span className="text-xs text-vedic-muted">or need consultation before enrolling?</span>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Talk to Admissions Team on WhatsApp</span>
                </a>
              </div>

              {/* Security & Guarantee Trust Footnote */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-vedic-muted">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Payment</span>
                </span>
                <span>7-Day Satisfaction Guarantee</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
