"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-ivory min-h-screen py-24 px-4 sm:px-6">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-border p-10 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-saffron-50 text-saffron-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-vedic-dark">
            Your Cart is Empty
          </h1>
          <p className="text-xs text-vedic-muted leading-relaxed">
            You haven&apos;t added any sacred gemstones, Siddh yantras, or spiritual remedies yet.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              <span>Explore Sacred Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-border pb-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark">
              Shopping Cart
            </h1>
            <p className="text-xs text-vedic-muted">
              Review your consecrated sacred items before proceeding to checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl border border-border p-4 sm:p-5 flex gap-4 items-center shadow-xs"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-ivory-card shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                    {item.product.categoryLabel}
                  </span>
                  <h3 className="font-serif text-base font-bold text-vedic-dark truncate">
                    <Link href={`/shop/${item.product.slug}`} className="hover:text-saffron-700">
                      {item.product.name}
                    </Link>
                  </h3>
                  <div className="font-serif font-bold text-saffron-700 text-sm mt-0.5">
                    ₹{item.product.price.toLocaleString("en-IN")}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg bg-ivory">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white text-vedic-muted hover:text-vedic-dark"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white text-vedic-muted hover:text-vedic-dark"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-serif font-bold text-sm text-vedic-dark">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-4 sticky top-24">
              <h2 className="font-serif text-lg font-bold text-vedic-dark border-b border-border pb-3">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs text-vedic-dark">
                <div className="flex justify-between">
                  <span className="text-vedic-muted">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vedic-muted">Estimated Shipping</span>
                  <span className="font-semibold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vedic-muted">Vedic Pran-Pratishtha</span>
                  <span className="font-semibold text-gold-700">INCLUDED</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-sm font-bold">
                  <span>Total Payable</span>
                  <span className="font-serif text-xl text-saffron-700">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs shadow-md transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-3 border-t border-border/70 space-y-2 text-[11px] text-vedic-muted">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
                  <span>Insured delivery across India (3–7 Days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Genuine Certified Natural Articles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
