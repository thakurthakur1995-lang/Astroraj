import type { Metadata } from "next";
import { Geist, Cinzel } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SITE_SETTINGS } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://astroraj.org"),
  title: {
    default: "Astro Raj | Vedic Astrology & Spiritual Guidance by Astrologer Rajat Thakur",
    template: "%s | Astro Raj - Astrologer Rajat Thakur",
  },
  description:
    "Personalized Vedic Astrology consultation, Kundli analysis, authentic online pujas, and certified gemstones by Astrologer Rajat Thakur in Rishikesh. 12+ years experience in Shri Vidya Upasana.",
  keywords: [
    "Astrologer Rajat Thakur",
    "Astro Raj",
    "Vedic Astrology Rishikesh",
    "Kundli Analysis",
    "Personal Astrology Consultation",
    "Online Puja Services",
    "Baglamukhi Pooja",
    "Shri Chakra Pooja",
    "Certified Gemstones",
    "Manglik Dosha Remedies",
    "Career Astrology",
    "Marriage Kundli Milan",
  ],
  authors: [{ name: "Astrologer Rajat Thakur" }],
  creator: "Astrologer Rajat Thakur",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://astroraj.org",
    title: "Astro Raj | Vedic Astrology & Spiritual Guidance by Astrologer Rajat Thakur",
    description:
      "Find clarity in your career, relationships, and spiritual path through authentic Vedic Jyotish and personalized consultations.",
    siteName: "Astro Raj",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Astrologer Rajat Thakur - Astro Raj",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Astro Raj | Vedic Astrology & Spiritual Guidance",
    description: "Personalized Vedic Astrology, Kundli analysis, and online pujas by Astrologer Rajat Thakur.",
    images: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"],
  },
  alternates: {
    canonical: "https://astroraj.org",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${cinzel.variable} h-full scroll-smooth`}>
      <head>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${SITE_SETTINGS.gaMeasurementId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${SITE_SETTINGS.gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-vedic-dark antialiased pb-16 md:pb-0">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-grow">{children}</main>
          <Footer />
          <MobileStickyBar />
        </CartProvider>
      </body>
    </html>
  );
}
