import React, { Suspense } from "react";
import type { Metadata } from "next";
import { OrderConfirmationClient } from "@/components/shop/OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Order Confirmation | Astro Raj Sacred Shop",
  description: "Your sacred order details and Pran-Pratishtha dispatch confirmation.",
};

export default function OrderConfirmationPage() {
  return (
    <div className="bg-ivory min-h-screen py-8">
      <Suspense fallback={<div className="text-center py-20">Loading order summary...</div>}>
        <OrderConfirmationClient />
      </Suspense>
    </div>
  );
}
