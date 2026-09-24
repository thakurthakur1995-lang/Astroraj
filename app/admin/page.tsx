import React from "react";
import type { Metadata } from "next";
import { 
  getAllBookings, 
  getAllOrders, 
  getServices, 
  getProducts, 
  getAllContactMessages 
} from "@/lib/supabase/repository";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Management Portal | Astro Raj",
  description: "Administrative dashboard for managing consultations, orders, services, and site settings.",
  robots: "noindex, nofollow",
};

export default async function AdminPage() {
  const [bookings, orders, services, products, messages] = await Promise.all([
    getAllBookings(),
    getAllOrders(),
    getServices(),
    getProducts(),
    getAllContactMessages(),
  ]);

  return (
    <AdminDashboard
      initialBookings={bookings}
      initialOrders={orders}
      services={services}
      products={products}
      contactMessages={messages}
    />
  );
}
