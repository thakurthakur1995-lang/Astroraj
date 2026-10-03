import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBySlug, getCourses } from "@/lib/supabase/repository";
import { CourseDetailClient } from "@/components/courses/CourseDetailClient";
import { SITE_SETTINGS } from "@/lib/constants";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found | Astro Raj Academy",
    };
  }

  const title = `${course.title} | Astro Raj Academy`;
  const description = course.shortDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://astroraj.org/courses/${course.slug}`,
      siteName: SITE_SETTINGS.brandName,
      images: [
        {
          url: course.image,
          width: 800,
          height: 600,
          alt: course.title,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    alternates: {
      canonical: `https://astroraj.org/courses/${course.slug}`,
    },
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const [course, allCourses] = await Promise.all([
    getCourseBySlug(slug),
    getCourses(),
  ]);

  if (!course) {
    notFound();
  }

  const relatedCourses = allCourses
    .filter((c) => c.id !== course.id)
    .slice(0, 3);

  // Schema.org Course JSON-LD for SEO rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription,
    provider: {
      "@type": "Organization",
      name: SITE_SETTINGS.brandName,
      sameAs: "https://astroraj.org",
    },
    instructor: {
      "@type": "Person",
      name: SITE_SETTINGS.astrologerName,
      jobTitle: "Vedic Astrologer & Vastu Guru",
    },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `https://astroraj.org/courses/${course.slug}`,
      validFrom: "2024-01-01",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: course.mode.toLowerCase().includes("recorded") ? "online-recorded" : "online-live",
      courseWorkload: course.duration,
      instructor: {
        "@type": "Person",
        name: SITE_SETTINGS.astrologerName,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CourseDetailClient course={course} relatedCourses={relatedCourses} />
    </>
  );
}
