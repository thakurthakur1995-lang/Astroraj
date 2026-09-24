import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { BlogPost } from "@/lib/types";

interface BlogPreviewProps {
  posts: BlogPost[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  const recent = posts.slice(0, 3);

  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
              <span>Vedic Knowledge Portal</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-vedic-dark tracking-tight">
              Latest Astrological Insights & Remedies
            </h2>
            <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
              Explore authentic scriptural insights, debunk common astrological fears, and learn the science behind Vedic rituals and gemstones.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition-colors"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recent.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:border-saffron-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-ivory-card">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-vedic-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-vedic-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTimeMinutes} min read</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.publishedAt}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-vedic-dark group-hover:text-saffron-700 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-vedic-muted line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                  <span className="text-xs font-medium text-vedic-dark">
                    By {post.author.name}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-saffron-700 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
