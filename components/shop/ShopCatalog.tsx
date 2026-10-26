"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShieldCheck, ShoppingBag, ChevronDown, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

interface ShopCatalogProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 20;

export function ShopCatalog({ products }: ShopCatalogProps) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "diwali-items", label: "Diwali Items" },
    { id: "gemstones", label: "Certified Gemstones" },
    { id: "rudraksha", label: "Rudraksh" },
    { id: "mala", label: "Mala" },
    { id: "yantra", label: "Siddh Yantras" },
    { id: "spiritual", label: "Bracelets & Spiritual Corner" },
    { id: "ayurveda", label: "Ayurveda Wellness" },
  ];

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const filtered = products.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      item.category === selectedCategory ||
      (Array.isArray(item.categories) && item.categories.includes(selectedCategory));
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const progressPercentage = Math.min(100, Math.round((displayedProducts.length / (filtered.length || 1)) * 100));

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search & Category Chips */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedCategory === cat.id
                  ? "bg-saffron-600 text-white shadow-xs"
                  : "bg-ivory text-vedic-dark hover:bg-ivory-card border border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-vedic-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-ivory rounded-xl border border-border text-xs text-vedic-dark focus:outline-hidden focus:border-saffron-600"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-vedic-dark">No products found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-border overflow-hidden hover:border-saffron-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Product Image Link */}
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative h-56 w-full overflow-hidden bg-ivory-card block cursor-pointer"
                >
                  <Image
                    src={product.images[0] || "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=400&q=80"}
                    alt={product.name}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                </Link>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-vedic-dark group-hover:text-saffron-700 transition-colors line-clamp-1">
                      <Link href={`/shop/${product.slug}`} className="cursor-pointer">
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
                      className="p-2 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white shadow-xs transition-colors cursor-pointer"
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

          {/* Pagination / Load More Footer */}
          <div className="pt-6 pb-2 flex flex-col items-center justify-center space-y-4">
            {/* Progress Bar & Text */}
            <div className="text-center space-y-2 w-full max-w-xs">
              <div className="flex items-center justify-between text-xs text-vedic-muted">
                <span>Showing <strong className="text-vedic-dark">{displayedProducts.length}</strong> of <strong className="text-vedic-dark">{filtered.length}</strong> products</span>
                <span className="font-semibold text-saffron-700">{progressPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-saffron-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {hasMore ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filtered.length))}
                  className="px-6 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-2 group"
                >
                  <span>Load More Products (+{Math.min(ITEMS_PER_PAGE, filtered.length - displayedProducts.length)})</span>
                  <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => setVisibleCount(filtered.length)}
                  className="px-4 py-2.5 bg-white hover:bg-ivory border border-border text-vedic-dark rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  View All ({filtered.length})
                </button>
              </div>
            ) : filtered.length > ITEMS_PER_PAGE ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border/80 text-vedic-muted text-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                <span>You are viewing all {filtered.length} sacred items</span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
