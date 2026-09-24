import React from "react";
import { 
  getServices, 
  getProducts, 
  getTestimonials, 
  getFaqs, 
  getBlogPosts 
} from "@/lib/supabase/repository";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { FourPillars } from "@/components/home/FourPillars";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularServices } from "@/components/home/PopularServices";
import { WhyChooseGuruji } from "@/components/home/WhyChooseGuruji";
import { AboutPreview } from "@/components/home/AboutPreview";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BlogPreview } from "@/components/home/BlogPreview";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";

export const revalidate = 3600; // 1 hour cache

export default async function HomePage() {
  const [services, products, testimonials, faqs, blogPosts] = await Promise.all([
    getServices(),
    getProducts(),
    getTestimonials(),
    getFaqs(),
    getBlogPosts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Trust & Credentials Bar */}
      <TrustBar />

      {/* 3. What Are You Looking For? (4 Core Pillars) */}
      <FourPillars />

      {/* 4. How It Works Timeline */}
      <HowItWorks />

      {/* 5. Popular Services */}
      <PopularServices services={services} />

      {/* 6. Why People Choose Guruji */}
      <WhyChooseGuruji />

      {/* 7. Meet Astrologer Rajat Thakur */}
      <AboutPreview />

      {/* 8. Transparent Pricing Matrix */}
      <PricingSection />

      {/* 9. Authentic Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 10. Consecrated Products */}
      <FeaturedProducts products={products} />

      {/* 11. Blog & Vedic Insights */}
      <BlogPreview posts={blogPosts} />

      {/* 12. FAQ Accordion */}
      <FaqSection faqs={faqs} />

      {/* 13. Final Conversion CTA */}
      <FinalCta />
    </div>
  );
}
