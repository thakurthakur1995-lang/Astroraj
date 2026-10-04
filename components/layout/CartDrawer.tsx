"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  // Prevent background scrolling on mobile & desktop when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-vedic-dark/60 backdrop-blur-xs sm:backdrop-blur-sm transition-opacity cursor-pointer animate-backdrop-in"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Container */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-auto max-w-full flex justify-end sm:pl-10 pointer-events-none">
        <div className="w-full sm:w-[420px] max-w-full bg-ivory text-vedic-dark shadow-2xl flex flex-col pointer-events-auto h-full max-h-screen animate-drawer-in">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingBag className="w-5 h-5 text-saffron-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-serif font-bold text-vedic-dark truncate">
                Your Spiritual Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-vedic-muted hover:text-vedic-dark hover:bg-ivory-card rounded-full transition-colors cursor-pointer shrink-0 ml-2"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 sm:space-y-4 overscroll-contain">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-saffron-50 flex items-center justify-center text-saffron-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-vedic-dark mb-1">Your cart is empty</h3>
                <p className="text-xs sm:text-sm text-vedic-muted max-w-xs mb-6">
                  Explore our consecrated gemstones, Siddh yantras, and Vedic wellness remedies.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm cursor-pointer"
                >
                  Explore Sacred Shop
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 bg-white rounded-xl border border-border/80 shadow-xs flex gap-3 items-center"
                >
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-ivory-card shrink-0">
                    <Image
                      src={item.product.images[0] || "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=400&q=80"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gold-600 block truncate">
                      {item.product.categoryLabel}
                    </span>
                    <h4 className="text-sm font-semibold text-vedic-dark truncate">
                      <Link
                        href={item.product.isCourse ? `/courses/${item.product.slug}` : `/shop/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="hover:text-saffron-700 transition-colors cursor-pointer"
                      >
                        {item.product.name}
                      </Link>
                    </h4>
                    <div className="text-sm font-bold text-saffron-700 mt-0.5">
                      ₹{item.product.price.toLocaleString("en-IN")}
                    </div>

                    <div className="flex items-center justify-between mt-2 gap-2">
                      <div className="flex items-center border border-border rounded-md bg-ivory">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-white text-vedic-muted hover:text-vedic-dark transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-white text-vedic-muted hover:text-vedic-dark transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer rounded-md hover:bg-red-50"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-border bg-white space-y-3 shrink-0 pb-6 sm:pb-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-vedic-muted">Subtotal</span>
                <span className="text-base sm:text-lg font-bold text-vedic-dark font-serif">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-vedic-muted leading-relaxed">
                {cart.some((item) => !item.product.isCourse)
                  ? "Free consecrated shipping across India. Standard taxes included."
                  : "Instant digital enrollment & access after payment. Standard taxes included."}
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-2.5 px-3 text-center border border-border text-vedic-dark hover:bg-ivory rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="py-2.5 px-3 text-center bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
