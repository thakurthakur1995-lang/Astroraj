import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, CalendarPlus, Share2, Sparkles } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/supabase/repository";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found | Astro Raj" };
  }

  return {
    title: `${post.title} | Astro Raj Knowledge Portal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPosts();
  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="bg-ivory min-h-screen py-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-vedic-muted hover:text-vedic-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-vedic-muted">
            <span className="bg-saffron-50 text-saffron-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span>•</span>
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

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vedic-dark tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Author snippet */}
          <div className="flex items-center gap-3 pt-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-vedic-brown">
              <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
            </div>
            <div>
              <div className="text-xs font-bold text-vedic-dark">{post.author.name}</div>
              <div className="text-[11px] text-vedic-muted">{post.author.role}</div>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-lg border border-border bg-ivory-card">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-12 shadow-xs space-y-6 text-sm sm:text-base text-vedic-dark/90 leading-relaxed font-sans">
          <div className="whitespace-pre-line space-y-4">
            {post.content}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-vedic-muted mr-1">Tags:</span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-ivory text-vedic-dark border border-border rounded-lg text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio & Consultation Prompt */}
        <div className="p-8 rounded-3xl bg-vedic-dark text-white flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-gold-400">
            <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h3 className="font-serif text-lg font-bold text-white">
              Consult Directly with {post.author.name}
            </h3>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              Have specific questions regarding your birth chart, planetary yogas, or sacred remedies discussed in this article? Book a confidential audio or video consultation.
            </p>
            <div className="pt-2">
              <Link
                href="/book-consultation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs shadow-md transition-all"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Book Live Consultation</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="font-serif text-2xl font-bold text-vedic-dark">
              Related Vedic Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-border p-5 space-y-3 hover:shadow-lg transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-base font-bold text-vedic-dark line-clamp-2">
                    <Link href={`/blog/${item.slug}`} className="hover:text-saffron-700">
                      {item.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-vedic-muted line-clamp-2">
                    {item.excerpt}
                  </p>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="inline-block text-xs font-bold text-saffron-700 hover:underline pt-1"
                  >
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
