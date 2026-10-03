import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay";
import {
  validateAndCalculateBookingPrice,
  validateAndCalculateOrderPrice,
} from "@/lib/pricing";
import {
  createBooking,
  createOrder,
  recordPaymentTransaction,
} from "@/lib/supabase/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    const razorpay = getRazorpayClient();
    const clientKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();

    if (!clientKeyId) {
      return NextResponse.json(
        { success: false, message: "NEXT_PUBLIC_RAZORPAY_KEY_ID is missing from environment variables." },
        { status: 500 }
      );
    }

    // ==========================================
    // 1. BOOKING ORDER CREATION
    // ==========================================
    if (type === "booking") {
      const {
        serviceId,
        consultationType,
        durationMinutes,
        urgency,
        date,
        timeSlot,
        customerDetails,
      } = body;

      if (!serviceId || !consultationType || !durationMinutes || !urgency) {
        return NextResponse.json(
          { success: false, message: "Missing required booking consultation options." },
          { status: 400 }
        );
      }

      if (!customerDetails || !customerDetails.fullName || !customerDetails.email || !customerDetails.phone) {
        return NextResponse.json(
          { success: false, message: "Customer name, email and phone number are required." },
          { status: 400 }
        );
      }

      // Calculate and validate amount strictly server-side
      const pricing = await validateAndCalculateBookingPrice({
        serviceId,
        consultationType,
        durationMinutes: Number(durationMinutes),
        urgency,
      });

      const receipt = `bkg_${Date.now().toString().slice(-8)}`;

      // Create Razorpay Order
      const rzpOrder = await razorpay.orders.create({
        amount: pricing.amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          type: "booking",
          serviceId,
          consultationType,
          customerName: customerDetails.fullName,
          customerEmail: customerDetails.email,
        },
      });

      // Save preliminary booking in Supabase with pending status
      const bookingRecord = await createBooking({
        serviceId,
        serviceTitle: pricing.serviceTitle,
        consultationType,
        durationMinutes: Number(durationMinutes) as 15 | 30 | 45 | 60,
        urgency,
        date: date || new Date().toISOString().split("T")[0],
        timeSlot: timeSlot || "11:00 AM - 11:30 AM",
        price: pricing.priceInINR,
        originalPrice: pricing.originalPrice,
        ...customerDetails,
        status: "pending",
        paymentStatus: "pending",
        razorpayOrderId: rzpOrder.id,
      });

      // Audit log in payments table
      await recordPaymentTransaction({
        razorpayOrderId: rzpOrder.id,
        entityType: "booking",
        entityId: bookingRecord.bookingCode,
        amount: pricing.priceInINR,
        status: "created",
      });

      return NextResponse.json({
        success: true,
        orderId: rzpOrder.id,
        amount: rzpOrder.amount, // in paise
        currency: rzpOrder.currency,
        keyId: clientKeyId,
        bookingCode: bookingRecord.bookingCode,
        bookingId: bookingRecord.id,
      });
    }

    // ==========================================
    // 2. SHOP PRODUCTS ORDER CREATION
    // ==========================================
    if (type === "order") {
      const { items, customerDetails } = body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { success: false, message: "Cart items are required to create an order." },
          { status: 400 }
        );
      }

      if (!customerDetails || !customerDetails.fullName || !customerDetails.email || !customerDetails.phone) {
        return NextResponse.json(
          { success: false, message: "Customer shipping and contact details are required." },
          { status: 400 }
        );
      }

      // Calculate and validate amounts strictly server-side from product database
      const pricing = await validateAndCalculateOrderPrice(items);

      const receipt = `ord_${Date.now().toString().slice(-8)}`;

      // Create Razorpay Order
      const rzpOrder = await razorpay.orders.create({
        amount: pricing.amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          type: "order",
          customerName: customerDetails.fullName,
          customerEmail: customerDetails.email,
          itemCount: String(pricing.validatedItems.length),
        },
      });

      // Save preliminary order in Supabase with pending status
      const orderRecord = await createOrder({
        customer: {
          fullName: customerDetails.fullName,
          email: customerDetails.email,
          phone: customerDetails.phone,
          shippingAddress: customerDetails.shippingAddress || {
            street: customerDetails.street || "",
            city: customerDetails.city || "",
            state: customerDetails.state || "Uttarakhand",
            postalCode: customerDetails.postalCode || "",
            country: customerDetails.country || "India",
          },
          orderNotes: customerDetails.orderNotes || "",
        },
        items: pricing.validatedItems,
        subtotal: pricing.subtotal,
        shippingFee: pricing.shippingFee,
        total: pricing.total,
        paymentStatus: "pending",
        orderStatus: "processing",
        razorpayOrderId: rzpOrder.id,
      });

      // Audit log in payments table
      await recordPaymentTransaction({
        razorpayOrderId: rzpOrder.id,
        entityType: "order",
        entityId: orderRecord.orderNumber,
        amount: pricing.total,
        status: "created",
      });

      return NextResponse.json({
        success: true,
        orderId: rzpOrder.id,
        amount: rzpOrder.amount, // in paise
        currency: rzpOrder.currency,
        keyId: clientKeyId,
        orderNumber: orderRecord.orderNumber,
        orderIdInternal: orderRecord.id,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid order type. Expected 'booking' or 'order'." },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Razorpay order creation error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create Razorpay order. Please try again.";
    return NextResponse.json(
      {
        success: false,
        message: msg,
      },
      { status: 500 }
    );
  }
}
