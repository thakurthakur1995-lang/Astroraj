import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/supabase/repository";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Astro Raj" };
  }

  return {
    title: `${product.name} | Astro Raj Sacred Shop`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-vedic-muted hover:text-vedic-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sacred Shop</span>
          </Link>
        </div>

        {/* Product Detail Interactive Client */}
        <ProductDetailClient product={product} />

        {/* Deep Description & Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Detailed Scriptural Background */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-vedic-dark">
              Spiritual Background & Vedic Significance
            </h2>
            <div className="text-sm text-vedic-dark/85 leading-relaxed space-y-3">
              <p>{product.description}</p>
              <p>
                In the tradition of Astrologer Rajat Thakur, physical remedies must resonate with pure sattvic intention. Every sacred article is cleansed with holy Ganga water and sanctified with authentic Vedic stotras to awaken its subtle energetic matrix before dispatch.
              </p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-vedic-dark border-b border-border pb-3">
              Item Specifications
            </h3>
            <div className="space-y-3 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-vedic-muted">{key}</span>
                  <span className="font-semibold text-vedic-dark text-right">{val}</span>
                </div>
              ))}
              {product.origin && (
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-vedic-muted">Origin</span>
                  <span className="font-semibold text-vedic-dark">{product.origin}</span>
                </div>
              )}
              {product.certificationAuthority && (
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-vedic-muted">Certification</span>
                  <span className="font-semibold text-emerald-800">{product.certificationAuthority}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="font-serif text-2xl font-bold text-vedic-dark">
              Complementary Sacred Offerings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-ivory-card">
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif text-sm font-bold text-vedic-dark truncate">
                      {item.name}
                    </h3>
                    <div className="font-serif font-bold text-saffron-700 text-sm">
                      ₹{item.price.toLocaleString("en-IN")}
                    </div>
                    <Link
                      href={`/shop/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800 pt-2"
                    >
                      <span>View Item</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
