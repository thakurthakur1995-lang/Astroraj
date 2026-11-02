"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  X,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { PRODUCTS } from "@/lib/data/products";

const SESSION_STORAGE_KEY = "astroraj_diwali_alert_dismissed_v2";

export function DiwaliPromoPopup() {
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { addToCart } = useCart();

  const diwaliProduct = PRODUCTS.find((p) => p.id === "18-diwali-puja-items");

  useEffect(() => {
    setIsMounted(true);

    // Never show popup or alert if user is already on the Diwali product page
    if (pathname === "/shop/18-diwali-puja-items") {
      return;
    }

    try {
      const dismissed = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (dismissed === "true") {
        return;
      }
    } catch {
      // Ignore sessionStorage errors
    }

    // Gentle delay after page mount before showing bottom-right alert
    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleDismissAlert = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowAlert(false);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch {
      // Ignore
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);

    // Celebratory light golden sparkles confetti
    try {
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 40,
          spread: 55,
          origin: { y: 0.45 },
          colors: ["#fbbf24", "#f59e0b", "#d05e2d", "#fed7aa", "#fef3c7"],
          disableForReducedMotion: true,
          zIndex: 99999,
        });
      });
    } catch {
      // Ignore
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch {
      // Ignore
    }
  };

  const handleNavigateToProduct = () => {
    handleCloseModal();
    setShowAlert(false);
    router.push("/shop/18-diwali-puja-items");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (diwaliProduct) {
      addToCart(diwaliProduct, 1);
      handleCloseModal();
      setShowAlert(false);
    } else {
      handleNavigateToProduct();
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* 1. BOTTOM-RIGHT FESTIVE ALERT PILL (Blinks to attract user attention) */}
      {showAlert && !isModalOpen && (
        <aside
          aria-label="Diwali Special Announcement"
          className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 max-w-[calc(100vw-24px)] sm:max-w-md animate-popup-in"
        >
          <div
            onClick={handleOpenModal}
            className="group relative flex items-center gap-3 p-2.5 sm:p-3 pr-9 bg-white/95 backdrop-blur-md border-2 border-saffron-500 rounded-2xl sm:rounded-full shadow-2xl cursor-pointer transition-all hover:border-saffron-600 animate-festive-blink hover:scale-105 active:scale-95"
          >
            {/* Miniature product photo with glowing aura & pulsing badge */}
            <div className="relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-saffron-500/80 bg-saffron-50 shadow-sm">
              <Image
                src="/images/products/18-diwali-puja-items/18-diwali-puja-items-1.jpg"
                alt="18+ Diwali Puja Items"
                fill
                sizes="48px"
                className="object-cover"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-saffron-600"></span>
              </span>
            </div>

            {/* Alert text info */}
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-saffron-700 bg-saffron-100/90 px-2 py-0.5 rounded-full border border-saffron-300">
                  🪔 Diwali Offer
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Save 23%
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-vedic-dark truncate mt-0.5 group-hover:text-saffron-700 transition-colors">
                18+ Sacred Diwali Puja Kit • ₹2,100
              </p>
              <p className="text-[11px] text-vedic-muted truncate flex items-center gap-1">
                <span>Tap to view consecrated kit</span>
                <ArrowRight className="w-3 h-3 text-saffron-600 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismissAlert}
              aria-label="Dismiss Diwali alert"
              className="absolute top-2 right-2 p-1 text-vedic-muted hover:text-vedic-dark hover:bg-ivory rounded-full transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. ELEGANT, COMPACT & BEAUTIFUL DIWALI PRODUCT POPUP (Light Vedic Theme matching site) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="18+ Sacred Diwali Puja Items Kit"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
        >
          {/* Subtle semi-transparent backdrop */}
          <div
            className="fixed inset-0 bg-vedic-dark/60 backdrop-blur-xs animate-backdrop-in cursor-pointer transition-opacity"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          {/* Modal Card — Compact, Light & Highly Aesthetic */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md sm:max-w-lg bg-white border border-saffron-300/80 rounded-3xl shadow-2xl overflow-hidden text-vedic-dark animate-popup-in my-auto max-h-[92vh] flex flex-col z-10"
          >
            {/* Header with gentle saffron festive gradient */}
            <div className="bg-gradient-to-r from-saffron-50 via-ivory to-saffron-100/70 p-4 sm:p-5 border-b border-border flex items-start justify-between relative shrink-0">
              <div className="space-y-1 pr-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-saffron-100 border border-saffron-300 text-[11px] font-bold text-saffron-800 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-saffron-600 animate-pulse" />
                  <span>शुभ दीपावली विशेष ऑफर</span>
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-vedic-dark">
                  18+ Sacred Diwali Puja Items Kit
                </h2>
                <p className="text-xs text-vedic-muted">
                  संपूर्ण महालक्ष्मी-गणेश पूजन सामग्री • सिद्ध एवं प्राण-प्रतिष्ठित
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                aria-label="Close modal"
                className="p-1.5 rounded-full text-vedic-muted hover:text-vedic-dark hover:bg-white border border-border transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              {/* Product Image Card */}
              <div
                onClick={handleNavigateToProduct}
                className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-border shadow-xs group cursor-pointer bg-ivory-card"
              >
                <Image
                  src="/images/products/18-diwali-puja-items/18-diwali-puja-items-1.jpg"
                  alt="18+ Diwali Puja Items Kit Box"
                  fill
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-saffron-700/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Diwali Special Batch</span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-vedic-dark text-[11px] font-semibold px-2.5 py-0.5 rounded-md shadow-sm border border-border flex items-center gap-1 group-hover:text-saffron-700">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Sacred Highlights List */}
              <div className="bg-ivory rounded-2xl p-3 sm:p-3.5 border border-border/70 space-y-2 text-xs text-vedic-dark">
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">🪔</span>
                  <span>
                    <strong className="text-vedic-dark">18+ संपूर्ण पूजन सामग्री:</strong> कमलगट्टा माला, लक्ष्मी-कुबेर यंत्र, गोमती चक्र, पीली कौड़ियां, सुपारी व अक्षत
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">💧</span>
                  <span>
                    <strong className="text-vedic-dark">पवित्र जल व द्रव्य:</strong> शुद्ध गंगा जल, गुलाब जल, केवड़ा जल, शहद, शुद्ध घी व दिव्य इत्र
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">🌸</span>
                  <span>
                    <strong className="text-vedic-dark">प्राण-प्रतिष्ठित:</strong> 1008 महालक्ष्मी बीज मंत्रों द्वारा ऋषिकेश आश्रम में अभिमंत्रित
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">🚚</span>
                  <span>
                    <strong className="text-vedic-dark">फास्ट व सुरक्षित डिलीवरी:</strong> धनतेरस व दिवाली पूर्व फ्री एक्सप्रेस होम डिलीवरी
                  </span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-saffron-50/70 border border-saffron-200 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-vedic-muted font-bold block">
                    Special Consecrated Price
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-serif text-2xl sm:text-3xl font-extrabold text-saffron-700">
                      ₹2,100
                    </span>
                    <span className="text-xs sm:text-sm text-vedic-muted line-through">
                      ₹2,730
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      Save ₹630 (23% OFF)
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-white px-2 py-1 rounded-md border border-emerald-200 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In Stock</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleNavigateToProduct}
                  className="w-full bg-saffron-600 hover:bg-saffron-700 text-white font-serif font-bold text-sm py-2.5 px-4 rounded-xl shadow-md border border-saffron-700 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Order Diwali Kit (₹2,100)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleQuickAdd}
                  className="w-full bg-ivory hover:bg-ivory-card text-vedic-dark hover:text-saffron-700 border border-border font-serif font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4 text-saffron-600" />
                  <span>Instant Add to Cart</span>
                </button>
              </div>

              {/* Security and Consecration Assurance */}
              <p className="text-[11px] text-center text-vedic-muted pt-1">
                🔒 100% Shuddh Vedic Samagri • Pre-Sanctified by Astrologer Rajat Thakur
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
