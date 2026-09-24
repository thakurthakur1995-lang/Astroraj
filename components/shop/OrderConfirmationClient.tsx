"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Check, ShoppingBag, ArrowRight, MessageCircle, Truck } from "lucide-react";
import { SITE_SETTINGS } from "@/lib/constants";

export function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "ORD-94812";

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d05e2d", "#d4a359", "#472b20"],
      });
    } catch {
      // Safe fallback
    }
  }, []);

  const whatsappOrderUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    `Hari Om Guruji! I have placed an order with Order ID: ${orderNumber}. Kindly let me know the estimated consecration and courier tracking schedule.`
  )}`;

  return (
    <div className="max-w-xl mx-auto py-16 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-gold-400/40 p-8 sm:p-10 shadow-xl text-center space-y-6">
        <div className="w-18 h-18 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold ring-8 ring-emerald-50/50">
          <Check className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Payment Confirmed
          </span>
          <h1 className="font-serif text-3xl font-bold text-vedic-dark">
            Thank You for Your Order
          </h1>
          <p className="text-xs text-vedic-muted">
            Your sacred items are being prepared for Vedic Pran-Pratishtha in Rishikesh.
          </p>
        </div>

        <div className="p-4 bg-ivory rounded-2xl border border-border inline-block px-8">
          <span className="text-xs text-vedic-muted font-medium block">Order Number</span>
          <span className="font-mono text-xl font-bold text-saffron-700">{orderNumber}</span>
        </div>

        <div className="p-4 bg-ivory-card rounded-2xl text-left border border-border space-y-2 text-xs text-vedic-muted">
          <div className="flex items-center gap-2 text-vedic-dark font-semibold">
            <Truck className="w-4 h-4 text-saffron-600 shrink-0" />
            <span>Next Steps in Fulfillment:</span>
          </div>
          <p>
            1. Items undergo ritual cleansing with holy Ganga water in Rishikesh.<br />
            2. Pran-Pratishtha chanting performed on your name/gotra.<br />
            3. Dispatched in tamper-proof insured courier with live tracking sent via SMS & WhatsApp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notify on WhatsApp</span>
          </a>

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ivory hover:bg-ivory-card text-vedic-dark border border-border font-semibold text-xs"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
