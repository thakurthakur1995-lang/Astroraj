import { Metadata } from "next";
import { getCourses } from "@/lib/supabase/repository";
import { CoursesCatalog } from "@/components/courses/CoursesCatalog";
import { SITE_SETTINGS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Vedic Astrology, Vastu & Numerology Courses | Astro Raj Academy",
  description:
    "Learn authentic Vedic sciences directly from Astrologer Rajat Thakur. Certified practical courses in Advanced Vastu, Blank Chart Prediction, Mentorship, Rudraksha Science, and Numerology.",
  openGraph: {
    title: "Vedic Astrology, Vastu & Numerology Courses | Astro Raj Academy",
    description:
      "Join 1000+ students mastering ancient Vedic sciences with live interactive classes, lifetime recording access, and verified certifications.",
    url: "https://astroraj.org/courses",
    siteName: SITE_SETTINGS.brandName,
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://astroraj.org/courses",
  },
};

export default async function CoursesPage() {
  const courses = await getCourses();

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: course.title,
        description: course.shortDescription,
        provider: {
          "@type": "Organization",
          name: SITE_SETTINGS.brandName,
          sameAs: "https://astroraj.org",
        },
        offers: {
          "@type": "Offer",
          price: course.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `https://astroraj.org/courses/${course.slug}`,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CoursesCatalog courses={courses} />
    </>
  );
}
