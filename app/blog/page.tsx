import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { getBlogPosts } from "@/lib/supabase/repository";

export const metadata: Metadata = {
  title: "Vedic Astrology Insights & Remedies Blog | Astro Raj",
  description:
    "Read in-depth articles on Vedic astrology, Manglik dosha cancellation rules, the sacred geometry of Shree Yantra, and gemstone prescription principles by Astrologer Rajat Thakur.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Spiritual Knowledge Portal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight">
            Vedic Astrology Articles & Remedies
          </h1>
          <p className="text-sm sm:text-base text-vedic-muted leading-relaxed">
            Authentic scriptural reflections, practical remedies, and demystification of astrological myths written by Astrologer Rajat Thakur.
          </p>
        </div>

        {/* Featured Post (First post) */}
        {posts.length > 0 && (
          <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xs hover:shadow-xl transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 relative h-72 sm:h-96 w-full bg-ivory-card">
                <Image
                  src={posts[0].coverImage}
                  alt={posts[0].title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-vedic-muted">
                  <span className="bg-saffron-50 text-saffron-700 px-2.5 py-0.5 rounded font-bold uppercase">
                    {posts[0].category}
                  </span>
                  <span>•</span>
                  <span>{posts[0].readTimeMinutes} min read</span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-vedic-dark hover:text-saffron-700 transition-colors">
                  <Link href={`/blog/${posts[0].slug}`}>
                    {posts[0].title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-vedic-muted leading-relaxed">
                  {posts[0].excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-vedic-dark">
                    By {posts[0].author.name}
                  </span>
                  <Link
                    href={`/blog/${posts[0].slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 hover:text-saffron-800"
                  >
                    <span>Read Full Post</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(1).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:border-saffron-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
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
    </div>
  );
}
