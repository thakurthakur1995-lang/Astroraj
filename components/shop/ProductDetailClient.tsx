"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  ShieldCheck, 
  Check, 
  Plus, 
  Minus, 
  Truck, 
  RotateCcw, 
  MessageCircle, 
  Sparkles 
} from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { SITE_SETTINGS } from "@/lib/constants";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const whatsappInquiryUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
    `Hari Om Guruji! I have a question regarding the consecrated "${product.name}" (SKU: ${product.sku}).`
  )}`;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-ivory-card border border-border">
            <Image
              src={
                product.images[activeImageIndex] ||
                "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=800&q=80"
              }
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.certified && (
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-vedic-dark px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Govt. Lab Certified</span>
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-saffron-600 shadow-sm"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Ashram Sanctity Box */}
          <div className="p-4 bg-ivory rounded-2xl border border-gold-400/30 flex items-start gap-3 text-xs text-vedic-muted">
            <Sparkles className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-vedic-dark block">Consecrated in Rishikesh</span>
              Every item undergoes authentic Pran-Pratishtha on the banks of Maa Ganga with specific Beej Mantras prior to shipping.
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
              {product.categoryLabel} • SKU: {product.sku}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-vedic-dark">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-vedic-muted leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-ivory rounded-2xl border border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-vedic-muted block">Consecrated Price</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-saffron-700">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-vedic-muted line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              In Stock & Ready for Dispatch
            </span>
          </div>

          {/* Suitable Zodiacs (if gemstone) */}
          {product.suitableZodiac && product.suitableZodiac.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-vedic-dark block">
                Auspicious for Rashi / Ascendant:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.suitableZodiac.map((zodiac, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 bg-ivory-card text-vedic-dark rounded-md border border-border"
                  >
                    {zodiac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Spiritual Benefits */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-xs font-bold text-vedic-dark block uppercase tracking-wider">
              Vedic & Metaphysical Benefits:
            </span>
            <div className="space-y-1.5">
              {product.spiritualBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-vedic-dark">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity & Cart Actions */}
          <div className="pt-4 border-t border-border space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-vedic-dark">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg bg-ivory">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white text-vedic-muted hover:text-vedic-dark"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white text-vedic-muted hover:text-vedic-dark"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addToCart(product, quantity)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-saffron-600 text-saffron-700 hover:bg-saffron-50 font-semibold text-xs shadow-xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs shadow-md transition-colors"
              >
                <span>Buy Now with Free Delivery</span>
              </button>
            </div>

            <div className="pt-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask Guruji on WhatsApp About This Item</span>
              </a>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border text-[11px] text-vedic-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-saffron-600 shrink-0" />
              <span>Free Insured India Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Authenticity Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
