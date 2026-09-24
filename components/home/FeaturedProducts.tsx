"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addToCart } = useCart();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-20 bg-white border-y border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
              <span>Consecrated Store</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
              Consecrated Gemstones & Sacred Yantras
            </h2>
            <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
              100% natural, lab-tested gemstones and Siddh spiritual articles energized in Rishikesh with Vedic mantras.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition-colors"
          >
            <span>Visit Sacred Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <div
              key={product.id}
              className="bg-ivory rounded-2xl border border-border overflow-hidden hover:border-saffron-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Product Image */}
              <div className="relative h-56 w-full overflow-hidden bg-white">
                <Image
                  src={product.images[0] || "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=400&q=80"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Certified Badge */}
                {product.certified && (
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-vedic-dark px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Certified</span>
                  </span>
                )}

                {/* Category Badge */}
                <span className="absolute top-2.5 right-2.5 bg-vedic-dark/80 text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                  {product.categoryLabel}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif text-sm font-bold text-vedic-dark group-hover:text-saffron-700 transition-colors line-clamp-1">
                    <Link href={`/shop/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-[11px] text-vedic-muted line-clamp-2 mt-1">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/70 flex items-center justify-between">
                  <div>
                    <span className="font-serif text-base font-bold text-saffron-700">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-vedic-muted line-through ml-2">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="p-2 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white shadow-xs transition-colors"
                    title="Add to cart"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
