import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { 
  getAllBookings, 
  getAllOrders, 
  getServices, 
  getProducts, 
  getAllContactMessages 
} from "@/lib/supabase/repository";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Management Portal | Astro Raj",
  description: "Administrative dashboard for managing consultations, orders, services, and site settings.",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = verifyAdminSessionToken(token);

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

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
