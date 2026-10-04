"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, ArrowLeft, Lock, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { loadRazorpayScript, RazorpaySuccessResponse } from "@/lib/razorpay-client";
import { SITE_SETTINGS } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const hasPhysicalItems = cart.some((item) => !item.product.isCourse);
  const hasCourses = cart.some((item) => item.product.isCourse);

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
      <div className="bg-ivory min-h-screen py-24 text-center space-y-4">
        <h1 className="font-serif text-2xl font-bold text-vedic-dark">
          No items in cart to checkout
        </h1>
        <p className="text-xs text-vedic-muted">
          Your cart is currently empty. Explore our courses or sacred shop to add items.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/courses"
            className="px-6 py-2.5 bg-saffron-600 text-white rounded-lg text-xs font-semibold hover:bg-saffron-700 transition-colors"
          >
            Explore Courses
          </Link>
          <Link
            href="/shop"
            className="px-6 py-2.5 bg-ivory border border-border text-vedic-dark rounded-lg text-xs font-semibold hover:bg-ivory-card transition-colors"
          >
            Sacred Shop
          </Link>
        </div>
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
    if (hasPhysicalItems) {
      if (!customer.street.trim()) errs.street = "Please enter your street address.";
      if (!customer.city.trim()) errs.city = "Please enter your city.";
      if (!customer.postalCode.trim()) errs.postalCode = "Please enter your PIN code.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    try {
      // 1. Safely load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Unable to load Razorpay payment gateway. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // 2. Request order creation from server (price calculated server-side)
      const createOrderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          customerDetails: {
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            shippingAddress: {
              street: customer.street.trim() || (hasCourses ? "Digital Course Access" : "Standard Delivery"),
              city: customer.city.trim() || (hasCourses ? "Online Learning" : "Dehradun"),
              state: customer.state || "Uttarakhand",
              postalCode: customer.postalCode.trim() || (hasCourses ? "000000" : "248001"),
              country: customer.country || "India",
            },
            orderNotes: customer.orderNotes,
          },
        }),
      });

      const orderData = await createOrderRes.json();
      if (!createOrderRes.ok || !orderData.success) {
        alert(orderData.message || "Failed to initiate payment. Please try again.");
        setIsProcessing(false);
        return;
      }

      // 3. Open Razorpay Standard Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount, // in paise
        currency: orderData.currency || "INR",
        name: SITE_SETTINGS.brandName || "Astro Raj",
        description: `Order of ${cart.length} item(s) • Astro Raj`,
        image: "/favicon.ico",
        order_id: orderData.orderId,
        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.phone,
        },
        notes: {
          orderNumber: orderData.orderNumber,
        },
        theme: {
          color: "#d05e2d",
        },
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            // 4. Server-side HMAC SHA256 Signature Verification
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                entityType: "order",
                entityId: orderData.orderNumber,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(`/order-confirmation?orderNumber=${orderData.orderNumber}`);
            } else {
              alert(verifyData.message || "Payment verification failed. Please contact Astro Raj support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification encountered a network error. If amount was deducted, your order will be fulfilled.");
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

      if (!window.Razorpay) {
        alert("Razorpay is not available. Please refresh the page.");
        setIsProcessing(false);
        return;
      }

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on("payment.failed", function (response: { error: { code?: string; description?: string } }) {
        console.error("Razorpay Payment Failed:", response.error);
        alert(`Payment Failed: ${response.error?.description || "Transaction was declined."}`);
        setIsProcessing(false);
      });

      rzpInstance.open();
    } catch (err: unknown) {
      console.error("Checkout order creation error:", err);
      const errMsg = err instanceof Error ? err.message : "Error processing your order. Please try again.";
      alert(errMsg);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-vedic-muted hover:text-vedic-dark"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark mt-2">
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping & Contact Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-bold text-vedic-dark">
                {hasPhysicalItems ? "1. Customer & Delivery Information" : "1. Student & Contact Information"}
              </h2>
              <p className="text-xs text-vedic-muted">
                {hasPhysicalItems
                  ? "Please provide your exact address for insured sacred parcel dispatch from Rishikesh."
                  : "Please provide your contact details for course access credentials and WhatsApp batch updates."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-base sm:text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">
                  {hasCourses ? "Email (For Course Portal Access) *" : "Email Address *"}
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-base sm:text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.email && <p className="text-[11px] text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-vedic-dark">
                  {hasPhysicalItems
                    ? "Phone Number (For Courier Tracking) *"
                    : "Phone Number (For WhatsApp Student Group) *"}
                </label>
                <input
                  type="tel"
                  placeholder="10-digit WhatsApp number"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-base sm:text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.phone && <p className="text-[11px] text-red-600">{errors.phone}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-vedic-dark">
                  {hasPhysicalItems ? "Flat / House No. & Street Address *" : "Street Address (Optional)"}
                </label>
                <input
                  type="text"
                  placeholder={hasPhysicalItems ? "House/Flat number, Street name, Landmark" : "Optional for online courses"}
                  value={customer.street}
                  onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-base sm:text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.street && <p className="text-[11px] text-red-600">{errors.street}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">
                  {hasPhysicalItems ? "City *" : "City (Optional)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi, Mumbai"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-base sm:text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.city && <p className="text-[11px] text-red-600">{errors.city}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">State</label>
                <input
                  type="text"
                  value={customer.state}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-base sm:text-xs focus:outline-hidden focus:border-saffron-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">
                  {hasPhysicalItems ? "PIN Code *" : "PIN Code (Optional)"}
                </label>
                <input
                  type="text"
                  placeholder="6-digit postal PIN"
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-base sm:text-xs focus:outline-hidden focus:border-saffron-600"
                />
                {errors.postalCode && <p className="text-[11px] text-red-600">{errors.postalCode}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-vedic-dark">Country</label>
                <input
                  type="text"
                  disabled
                  value={customer.country}
                  className="w-full p-3 bg-ivory-card rounded-xl border border-border text-base sm:text-xs font-semibold text-vedic-muted"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-vedic-dark">
                  {hasPhysicalItems
                    ? "Delivery Instructions / Gotra for Sankalp"
                    : "Notes / Special Requests / Batch Timing Preference"}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    hasPhysicalItems
                      ? "Optional: Mention your family gotra or landmark..."
                      : "Optional: Mention your learning goals or batch queries..."
                  }
                  value={customer.orderNotes}
                  onChange={(e) => setCustomer({ ...customer, orderNotes: e.target.value })}
                  className="w-full p-3 bg-ivory rounded-xl border border-border text-base sm:text-xs focus:outline-hidden focus:border-saffron-600"
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
                {hasPhysicalItems && (
                  <>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-gold-700 font-semibold">
                      <span>Pran-Pratishtha</span>
                      <span>FREE</span>
                    </div>
                  </>
                )}
                {hasCourses && (
                  <>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Course Activation</span>
                      <span>INSTANT</span>
                    </div>
                    <div className="flex justify-between text-gold-700 font-semibold">
                      <span>Ashram Certificate</span>
                      <span>INCLUDED</span>
                    </div>
                  </>
                )}
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
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer"
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
