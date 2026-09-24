export type ConsultationType = "audio" | "video" | "in-person";
export type ConsultationUrgency = "normal" | "urgent";

export interface ConsultationPricingTier {
  id: string;
  durationMinutes: 15 | 30 | 45 | 60;
  type: ConsultationType;
  urgency: ConsultationUrgency;
  turnaroundDays: string; // e.g. "Within 24 Hours" or "7-15 Days"
  price: number;
  originalPrice?: number;
}

export type ServiceCategoryId = "astrology" | "puja" | "gemstones" | "ayurveda";

export interface ServiceCategory {
  id: ServiceCategoryId;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  badge?: string;
  featuredImage: string;
}

export interface Service {
  id: string;
  slug: string;
  categoryId: ServiceCategoryId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  priceStartingFrom: number;
  featured?: boolean;
  pricingTiers?: ConsultationPricingTier[];
  benefits: string[];
  inclusions: string[];
  processSteps: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "gemstones" | "rudraksha" | "yantra" | "ayurveda" | "spiritual";
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  description: string;
  images: string[];
  inStock: boolean;
  sku: string;
  featured?: boolean;
  certified?: boolean;
  certificationAuthority?: string;
  suitableZodiac?: string[];
  spiritualBenefits: string[];
  specifications: Record<string, string>;
  origin?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  location: string;
  rating: number;
  serviceName: string;
  reviewText: string;
  date: string;
  verified: boolean;
  avatar?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "consultation" | "kundli" | "puja" | "gemstones" | "payment";
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  category: string;
  tags: string[];
}

export interface BookingCustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  whatsappSameAsPhone: boolean;
  whatsappNumber?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:mm AM/PM or unknown
  timeIsApproximate?: boolean;
  placeOfBirth: string; // City, State, Country
  preferredLanguage?: "Hindi" | "English" | "Both";
  concernsTopic?: "Career" | "Marriage & Relationship" | "Health" | "Finance & Business" | "Spiritual / Kundli" | "Other";
  questionOrNotes?: string;
}

export interface BookingSelection {
  serviceId: string;
  serviceTitle: string;
  consultationType: ConsultationType;
  durationMinutes: 15 | 30 | 45 | 60;
  urgency: ConsultationUrgency;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:00 AM - 11:30 AM"
  price: number;
  originalPrice?: number;
}

export interface BookingRecord extends BookingCustomerDetails, BookingSelection {
  id: string;
  bookingCode: string; // e.g. "AR-2026-8941"
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  meetingLink?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderNotes?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string; // e.g. "ORD-94812"
  customer: OrderCustomerDetails;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  paymentId?: string;
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  astrologerName: string;
  phone: string;
  cleanPhone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  address: string;
  mapEmbedUrl: string;
  experienceYears: number;
  clientsServedCount: string;
  kundlisAnalyzedCount: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  officeHours: string;
  gaMeasurementId: string;
}
