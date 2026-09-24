import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ShoppingBag, ArrowRight, Filter } from "lucide-react";
import { getProducts } from "@/lib/supabase/repository";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

export const metadata: Metadata = {
  title: "Consecrated Gemstones & Sacred Yantras | Astro Raj Shop",
  description:
    "Buy 100% natural certified Vedic gemstones, Siddh Sphatik Shree Yantras, sacred rudraksha, and classical Ayurveda formulations consecrated in Rishikesh.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Shop Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
            <span>Rishikesh Consecrated Collection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight">
            Consecrated Gemstones & Sacred Articles
          </h1>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            Every gemstone is 100% naturally mined, laboratory-certified, and ritually energized with Vedic mantras in our Rishikesh ashram before dispatch.
          </p>
        </div>

        {/* Client Interactive Filter & Catalog */}
        <ShopCatalog products={products} />
      </div>
    </div>
  );
}
