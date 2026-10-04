import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import {
  markBookingPaymentPaid,
  markOrderPaymentPaid,
  markPaymentFailed,
  getBookingByRazorpayOrderId,
  getOrderByRazorpayOrderId,
  recordPaymentTransaction,
} from "@/lib/supabase/repository";
import {
  sendBookingConfirmationEmails,
  sendOrderConfirmationEmails,
} from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();

    // 1. Never trust unverified payloads: Webhook Secret MUST be configured
    if (!webhookSecret) {
      console.error(
        "[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured on the server. Rejecting payload."
      );
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    // 2. Reject request immediately if signature header is missing
    if (!signature) {
      console.warn("[Razorpay Webhook] Missing x-razorpay-signature header.");
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    // 3. Cryptographically verify signature using HMAC SHA256 over raw unparsed request body
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn("[Razorpay Webhook] Invalid webhook signature received.");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // 4. Safely parse verified payload
    const event = JSON.parse(rawBody);
    const eventName: string = event.event;
    const eventId: string = event.id || req.headers.get("x-razorpay-event-id") || "unknown";

    // Extract transaction identifiers safely (no secrets or sensitive data)
    const paymentEntity = event.payload?.payment?.entity;
    const orderEntity = event.payload?.order?.entity;
    const orderId: string | undefined = paymentEntity?.order_id || orderEntity?.id;
    const paymentId: string | undefined = paymentEntity?.id;

    console.log(
      `[Razorpay Webhook] Verified Event: "${eventName}" | EventID: ${eventId} | OrderID: ${orderId || "N/A"} | PaymentID: ${paymentId || "N/A"}`
    );

    // ==========================================
    // 5. HANDLE PAYMENT CAPTURED / ORDER PAID
    // ==========================================
    if (eventName === "payment.captured" || eventName === "order.paid") {
      if (!orderId) {
        console.warn(
          `[Razorpay Webhook] No order_id found in event ${eventName}. PaymentID: ${paymentId || "N/A"}`
        );
        return NextResponse.json({ received: true, note: "No order_id associated" });
      }

      // Extract paid amount in paise from payload (payment.entity.amount or order.entity.amount_paid)
      const paidAmountPaise = paymentEntity?.amount || orderEntity?.amount_paid || orderEntity?.amount;

      // Check Booking
      const booking = await getBookingByRazorpayOrderId(orderId);
      if (booking) {
        if (booking.paymentStatus === "paid") {
          console.log(
            `[Razorpay Webhook] Idempotency: Booking ${booking.bookingCode} (Order: ${orderId}) is already marked paid. Skipping duplicate update.`
          );
        } else {
          // Amount Verification: booking.price is in INR; Razorpay amounts are in paise
          const expectedPaise = Math.round(booking.price * 100);
          if (paidAmountPaise && paidAmountPaise < expectedPaise) {
            console.error(
              `[Razorpay Webhook] SECURITY ALERT: Amount Mismatch for Booking ${booking.bookingCode}! Expected ${expectedPaise} paise, received ${paidAmountPaise} paise. Aborting update.`
            );
            return NextResponse.json(
              { error: "Payment amount mismatch" },
              { status: 400 }
            );
          }

          const effectivePaymentId = paymentId || booking.paymentId || "webhook_captured";
          const updatedBooking = await markBookingPaymentPaid({
            razorpayOrderId: orderId,
            razorpayPaymentId: effectivePaymentId,
          });
          await recordPaymentTransaction({
            razorpayOrderId: orderId,
            entityType: "booking",
            entityId: booking.bookingCode,
            amount: booking.price,
            status: "captured",
            razorpayPaymentId: effectivePaymentId,
          });

          // Dispatch confirmation emails to customer and admin (non-blocking)
          sendBookingConfirmationEmails({
            booking: updatedBooking || booking,
            paymentId: effectivePaymentId,
          }).catch((err) => {
            console.error("[Razorpay Webhook] Error dispatching booking emails:", err);
          });

          console.log(
            `[Razorpay Webhook] Successfully verified and updated Booking ${booking.bookingCode} to PAID.`
          );
        }
      }

      // Check Shop Order
      const order = await getOrderByRazorpayOrderId(orderId);
      if (order) {
        if (order.paymentStatus === "paid") {
          console.log(
            `[Razorpay Webhook] Idempotency: Order ${order.orderNumber} (Order: ${orderId}) is already marked paid. Skipping duplicate update.`
          );
        } else {
          // Amount Verification: order.total is in INR; Razorpay amounts are in paise
          const expectedPaise = Math.round(order.total * 100);
          if (paidAmountPaise && paidAmountPaise < expectedPaise) {
            console.error(
              `[Razorpay Webhook] SECURITY ALERT: Amount Mismatch for Order ${order.orderNumber}! Expected ${expectedPaise} paise, received ${paidAmountPaise} paise. Aborting update.`
            );
            return NextResponse.json(
              { error: "Payment amount mismatch" },
              { status: 400 }
            );
          }

          const effectivePaymentId = paymentId || order.paymentId || "webhook_captured";
          const updatedOrder = await markOrderPaymentPaid({
            razorpayOrderId: orderId,
            razorpayPaymentId: effectivePaymentId,
          });
          await recordPaymentTransaction({
            razorpayOrderId: orderId,
            entityType: "order",
            entityId: order.orderNumber,
            amount: order.total,
            status: "captured",
            razorpayPaymentId: effectivePaymentId,
          });

          // Dispatch confirmation emails to customer and admin (non-blocking)
          sendOrderConfirmationEmails({
            order: updatedOrder || order,
            paymentId: effectivePaymentId,
          }).catch((err) => {
            console.error("[Razorpay Webhook] Error dispatching order emails:", err);
          });

          console.log(
            `[Razorpay Webhook] Successfully verified and updated Order ${order.orderNumber} to PAID.`
          );
        }
      }

      if (!booking && !order) {
        console.warn(
          `[Razorpay Webhook] Neither booking nor order found for orderId: ${orderId}. PaymentID: ${paymentId || "N/A"}`
        );
      }
    }

    // ==========================================
    // 6. HANDLE PAYMENT FAILED
    // ==========================================
    if (eventName === "payment.failed") {
      const errorDescription =
        paymentEntity?.error_description ||
        paymentEntity?.error_reason ||
        "Payment failed via webhook";

      if (orderId) {
        // Prevent race condition: do not overwrite if booking/order is already paid!
        const booking = await getBookingByRazorpayOrderId(orderId);
        if (booking && booking.paymentStatus === "paid") {
          console.log(
            `[Razorpay Webhook] Ignored payment.failed for Order ${orderId}: Booking ${booking.bookingCode} is already paid.`
          );
          return NextResponse.json({ received: true, ignored: "already_paid" });
        }

        const order = await getOrderByRazorpayOrderId(orderId);
        if (order && order.paymentStatus === "paid") {
          console.log(
            `[Razorpay Webhook] Ignored payment.failed for Order ${orderId}: Order ${order.orderNumber} is already paid.`
          );
          return NextResponse.json({ received: true, ignored: "already_paid" });
        }

        await markPaymentFailed({
          razorpayOrderId: orderId,
          error: errorDescription,
        });

        console.log(
          `[Razorpay Webhook] Recorded payment failure for Order: ${orderId}. Reason: ${errorDescription}`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Razorpay Webhook] Handler error:", errorMsg);
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
}

