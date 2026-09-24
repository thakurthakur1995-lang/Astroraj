import { supabase, isSupabaseConfigured } from "./client";
import { SERVICES, SERVICE_CATEGORIES } from "../data/services";
import { PRODUCTS } from "../data/products";
import { TESTIMONIALS } from "../data/testimonials";
import { FAQS } from "../data/faqs";
import { BLOG_POSTS } from "../data/blogs";
import { 
  Service, 
  ServiceCategory, 
  Product, 
  Testimonial, 
  FAQItem, 
  BlogPost, 
  BookingRecord, 
  OrderRecord 
} from "../types";

// In-memory runtime store for simulated bookings and orders during local demo / development
const runtimeBookings: BookingRecord[] = [
  {
    id: "bkg-101",
    bookingCode: "AR-2026-9812",
    serviceId: "personal-consultation",
    serviceTitle: "Personal Astrology Consultation (30 Min Video)",
    consultationType: "video",
    durationMinutes: 30,
    urgency: "urgent",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    timeSlot: "11:30 AM - 12:00 PM",
    price: 6200,
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    whatsappSameAsPhone: true,
    whatsappNumber: "+91 98765 43210",
    gender: "male",
    dateOfBirth: "1991-04-14",
    timeOfBirth: "06:45 AM",
    placeOfBirth: "Delhi, India",
    preferredLanguage: "Hindi",
    concernsTopic: "Career",
    questionOrNotes: "Looking for guidance regarding business partnership and promotion timeline.",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    meetingLink: "https://meet.google.com/xyz-astro-raj",
  },
  {
    id: "bkg-102",
    bookingCode: "AR-2026-9813",
    serviceId: "kundli-analysis",
    serviceTitle: "Kundli Analysis & Dosha Check (15 Min Audio)",
    consultationType: "audio",
    durationMinutes: 15,
    urgency: "normal",
    date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    timeSlot: "04:00 PM - 04:15 PM",
    price: 2100,
    fullName: "Priyanka Verma",
    email: "priyanka.verma@example.com",
    phone: "+91 98111 22334",
    whatsappSameAsPhone: true,
    gender: "female",
    dateOfBirth: "1994-09-28",
    timeOfBirth: "11:15 PM",
    placeOfBirth: "Jaipur, Rajasthan",
    preferredLanguage: "English",
    concernsTopic: "Marriage & Relationship",
    questionOrNotes: "Checking Mangal dosha compatibility for prospective marriage proposal.",
    status: "pending",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const runtimeOrders: OrderRecord[] = [
  {
    id: "ord-201",
    orderNumber: "ORD-94812",
    customer: {
      fullName: "Rohan Khanna",
      email: "rohan.khanna@example.com",
      phone: "+91 99887 76655",
      shippingAddress: {
        street: "B-402, Lotus Boulevard, Sector 100",
        city: "Noida",
        state: "Uttar Pradesh",
        postalCode: "201304",
        country: "India",
      },
    },
    items: [
      {
        productId: "all-siddh-shree-yantra-main-sphatik",
        productName: "All Siddh Shree Yantra (Main Sphatik)",
        price: 2699.25,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      },
      {
        productId: "dhanyog-bracelet",
        productName: "Dhanyog Abundance Bracelet",
        price: 824.25,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      },
    ],
    subtotal: 3523.5,
    shippingFee: 0,
    total: 3523.5,
    paymentStatus: "paid",
    orderStatus: "processing",
    createdAt: new Date().toISOString(),
  }
];

export interface ContactMessageRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
}

const runtimeContactMessages: ContactMessageRecord[] = [
  {
    id: "msg-1",
    fullName: "Sunita Deshmukh",
    email: "sunita.d@example.com",
    phone: "+91 91234 56789",
    subject: "Inquiry about Baglamukhi Havan at Rishikesh",
    message: "Hari Om Guruji, can family members attend the havan in person in Rishikesh?",
    status: "new",
    createdAt: new Date().toISOString(),
  }
];

export async function getServices(): Promise<Service[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true);
      if (!error && data && data.length > 0) {
        return data as Service[];
      }
    } catch {
      // Fallback
    }
  }
  return SERVICES;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) || null;
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  return SERVICE_CATEGORIES;
}

export async function getProducts(category?: string): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from("products").select("*");
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch {
      // Fallback
    }
  }
  if (category) {
    return PRODUCTS.filter((p) => p.category === category);
  }
  return PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) || null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return TESTIMONIALS;
}

export async function getFaqs(category?: string): Promise<FAQItem[]> {
  if (category) {
    return FAQS.filter((f) => f.category === category);
  }
  return FAQS;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return BLOG_POSTS;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getBlogPosts();
  return all.find((b) => b.slug === slug) || null;
}

// BOOKINGS
export async function createBooking(bookingData: Omit<BookingRecord, "id" | "bookingCode" | "createdAt" | "updatedAt">): Promise<BookingRecord> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const code = `AR-2026-${randomSuffix}`;
  const now = new Date().toISOString();

  const record: BookingRecord = {
    ...bookingData,
    id: `bkg-${Date.now()}`,
    bookingCode: code,
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from("bookings").insert({
        booking_code: record.bookingCode,
        service_id: record.serviceId,
        service_title: record.serviceTitle,
        consultation_type: record.consultationType,
        duration_minutes: record.durationMinutes,
        urgency: record.urgency,
        booking_date: record.date,
        time_slot: record.timeSlot,
        price: record.price,
        full_name: record.fullName,
        email: record.email,
        phone: record.phone,
        whatsapp_number: record.whatsappNumber,
        gender: record.gender,
        date_of_birth: record.dateOfBirth,
        time_of_birth: record.timeOfBirth,
        time_is_approximate: record.timeIsApproximate,
        place_of_birth: record.placeOfBirth,
        preferred_language: record.preferredLanguage,
        concerns_topic: record.concernsTopic,
        question_or_notes: record.questionOrNotes,
        status: record.status,
        payment_status: record.paymentStatus,
        payment_id: record.paymentId,
      });
    } catch {
      // In-memory fallback
    }
  }

  runtimeBookings.unshift(record);
  return record;
}

export async function getBookingByCode(code: string): Promise<BookingRecord | null> {
  return runtimeBookings.find((b) => b.bookingCode === code) || null;
}

export async function getAllBookings(): Promise<BookingRecord[]> {
  return runtimeBookings;
}

export async function updateBookingStatus(id: string, status: BookingRecord["status"]): Promise<boolean> {
  const idx = runtimeBookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    runtimeBookings[idx].status = status;
    runtimeBookings[idx].updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

// ORDERS
export async function createOrder(orderData: Omit<OrderRecord, "id" | "orderNumber" | "createdAt">): Promise<OrderRecord> {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `ORD-${randomSuffix}`;
  const now = new Date().toISOString();

  const record: OrderRecord = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber,
    createdAt: now,
  };

  runtimeOrders.unshift(record);
  return record;
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  return runtimeOrders;
}

// CONTACT MESSAGES
export async function submitContactMessage(data: { fullName: string; email: string; phone: string; subject?: string; message: string }) {
  const msg = {
    id: `msg-${Date.now()}`,
    ...data,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  runtimeContactMessages.unshift(msg);
  return msg;
}

export async function getAllContactMessages() {
  return runtimeContactMessages;
}

// ADMIN DASHBOARD STATS
export async function getAdminDashboardStats() {
  const totalBookings = runtimeBookings.length;
  const totalOrders = runtimeOrders.length;
  const bookingRevenue = runtimeBookings.reduce((sum, b) => (b.paymentStatus === "paid" ? sum + b.price : sum), 0);
  const orderRevenue = runtimeOrders.reduce((sum, o) => (o.paymentStatus === "paid" ? sum + o.total : sum), 0);
  const totalRevenue = bookingRevenue + orderRevenue;
  
  return {
    totalBookings,
    totalOrders,
    totalRevenue,
    activeServices: SERVICES.length,
    activeProducts: PRODUCTS.length,
    recentBookings: runtimeBookings.slice(0, 5),
    recentOrders: runtimeOrders.slice(0, 5),
  };
}
