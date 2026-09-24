"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, ArrowLeft, Lock, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/supabase/repository";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "Uttarakhand",
    postalCode: "",
    country: "India",
    orderNotes: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    return (
      <div className="bg-ivory min-h-screen py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-vedic-dark mb-4">
          No items in cart to checkout
        </h1>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-saffron-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customer.fullName.trim()) errs.fullName = "Please enter your name.";
    if (!customer.email.trim() || !customer.email.includes("@")) {
      errs.email = "Please enter a valid email address.";
    }
    if (!customer.phone.trim() || customer.phone.length < 10) {
      errs.phone = "Please enter a 10-digit phone number.";
    }
    if (!customer.street.trim()) errs.street = "Please enter your street address.";
    if (!customer.city.trim()) errs.city = "Please enter your city.";
    if (!customer.postalCode.trim()) errs.postalCode = "Please enter your PIN code.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    try {
      const order = await createOrder({
        customer: {
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          shippingAddress: {
            street: customer.street,
            city: customer.city,
            state: customer.state,
            postalCode: customer.postalCode,
            country: customer.country,
          },
          orderNotes: customer.orderNotes,
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0] || "",
        })),
        subtotal,
        shippingFee: 0,
        total: subtotal,
        paymentStatus: "paid",
        orderStatus: "processing",
        paymentId: `pay_${Date.now()}`,
      });

      clearCart();
      router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
    } catch {
      alert("Error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-vedic-muted hover:text-vedic-dark"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-vedic-dark mt-2">
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping & Contact Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-bold text-vedic-dark">
                1. Customer & Delivery Information
              </h2>
              <p className="text-xs text-vedic-muted">
                Please provide your exact address for insured sacred parcel dispatch from Rishikesh.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">Full Name *</label>
                <input
                  type="text"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">Email *</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.email && <p className="text-[11px] text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-vedic-dark">Phone Number (For Courier Tracking) *</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.phone && <p className="text-[11px] text-red-600">{errors.phone}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-vedic-dark">Flat / House No. & Street Address *</label>
                <input
                  type="text"
                  value={customer.street}
                  onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.street && <p className="text-[11px] text-red-600">{errors.street}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">City *</label>
                <input
                  type="text"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.city && <p className="text-[11px] text-red-600">{errors.city}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">State *</label>
                <input
                  type="text"
                  value={customer.state}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">PIN Code *</label>
                <input
                  type="text"
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.postalCode && <p className="text-[11px] text-red-600">{errors.postalCode}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">Country</label>
                <input
                  type="text"
                  disabled
                  value={customer.country}
                  className="w-full p-3 bg-ivory-card rounded-xl border border-border text-xs font-semibold text-vedic-muted"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-vedic-dark">Delivery Instructions / Gotra for Sankalp</label>
                <textarea
                  rows={2}
                  placeholder="Optional: Mention your family gotra or landmark..."
                  value={customer.orderNotes}
                  onChange={(e) => setCustomer({ ...customer, orderNotes: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden focus:border-saffron-600"
                />
              </div>
            </div>
          </div>

          {/* Order Summary & Payment Button */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-vedic-dark border-b border-border pb-3">
                Items in Order ({cart.length})
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs">
                    <span className="line-clamp-1 flex-1 pr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-bold text-vedic-dark shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between text-vedic-muted">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-gold-700 font-semibold">
                  <span>Pran-Pratishtha</span>
                  <span>FREE</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-vedic-dark">
                  <span>Total Amount</span>
                  <span className="font-serif text-xl text-saffron-700">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-ivory rounded-xl border border-border text-[11px] text-vedic-muted space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-vedic-dark">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Razorpay Safe Encryption</span>
                </div>
                <p>Supports UPI (GPay, PhonePe, Paytm), Debit/Credit Cards & Net Banking.</p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {isProcessing ? "Processing..." : `Pay ₹${subtotal.toLocaleString("en-IN")} via Razorpay`}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
