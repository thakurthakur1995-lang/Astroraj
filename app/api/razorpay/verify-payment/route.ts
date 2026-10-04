import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import {
  markBookingPaymentPaid,
  markOrderPaymentPaid,
  markPaymentFailed,
  recordPaymentTransaction,
  getBookingByRazorpayOrderId,
  getOrderByRazorpayOrderId,
} from "@/lib/supabase/repository";
import {
  sendBookingConfirmationEmails,
  sendOrderConfirmationEmails,
} from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      entityType,
      entityId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Razorpay verification parameters (order_id, payment_id, signature).",
        },
        { status: 400 }
      );
    }

    // 1. Verify HMAC SHA256 Signature using RAZORPAY_KEY_SECRET
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.error(
        `[Razorpay Signature Verification Failed] Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`
      );

      // Record failure state
      await markPaymentFailed({
        razorpayOrderId: razorpay_order_id,
        error: "Cryptographic signature mismatch. Possible tampering attempt.",
      });

      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed. Invalid transaction signature.",
        },
        { status: 400 }
      );
    }

    // 2. Idempotency Check & Entity Correlation
    if (entityType === "booking") {
      const existing = await getBookingByRazorpayOrderId(razorpay_order_id);
      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            message: "No booking record found matching this Razorpay transaction.",
          },
          { status: 404 }
        );
      }

      // Validate entity identifier correlation if provided
      if (entityId && existing.bookingCode !== entityId) {
        console.error(
          `[Razorpay Verification] Entity mismatch! Provided: ${entityId}, Record: ${existing.bookingCode}`
        );
        return NextResponse.json(
          {
            success: false,
            message: "Security error: Transaction entity identifier mismatch.",
          },
          { status: 400 }
        );
      }

      if (existing.paymentStatus === "paid") {
        try {
          await sendBookingConfirmationEmails({
            booking: existing,
            paymentId: razorpay_payment_id || existing.razorpayPaymentId,
          });
        } catch (err) {
          console.error("[verify-payment] Error dispatching booking emails on already verified:", err);
        }

        return NextResponse.json({
          success: true,
          message: "Payment already verified.",
          alreadyVerified: true,
          booking: existing,
        });
      }

      const updated = await markBookingPaymentPaid({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      await recordPaymentTransaction({
        razorpayOrderId: razorpay_order_id,
        entityType: "booking",
        entityId: existing.bookingCode,
        amount: existing.price,
        status: "captured",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      // Dispatch confirmation emails to customer and admin (awaited for serverless compatibility)
      const bookingData = updated || existing;
      try {
        await sendBookingConfirmationEmails({
          booking: bookingData,
          paymentId: razorpay_payment_id,
        });
      } catch (err) {
        console.error("[verify-payment] Error dispatching booking emails:", err);
      }

      return NextResponse.json({
        success: true,
        message: "Booking payment verified and confirmed successfully.",
        booking: updated,
      });
    }

    if (entityType === "order") {
      const existing = await getOrderByRazorpayOrderId(razorpay_order_id);
      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            message: "No shop order record found matching this Razorpay transaction.",
          },
          { status: 404 }
        );
      }

      // Validate entity identifier correlation if provided
      if (entityId && existing.orderNumber !== entityId) {
        console.error(
          `[Razorpay Verification] Entity mismatch! Provided: ${entityId}, Record: ${existing.orderNumber}`
        );
        return NextResponse.json(
          {
            success: false,
            message: "Security error: Transaction entity identifier mismatch.",
          },
          { status: 400 }
        );
      }

      if (existing.paymentStatus === "paid") {
        try {
          await sendOrderConfirmationEmails({
            order: existing,
            paymentId: razorpay_payment_id || existing.razorpayPaymentId,
          });
        } catch (err) {
          console.error("[verify-payment] Error dispatching order emails on already verified:", err);
        }

        return NextResponse.json({
          success: true,
          message: "Payment already verified.",
          alreadyVerified: true,
          order: existing,
        });
      }

      const updated = await markOrderPaymentPaid({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      await recordPaymentTransaction({
        razorpayOrderId: razorpay_order_id,
        entityType: "order",
        entityId: existing.orderNumber,
        amount: existing.total,
        status: "captured",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      // Dispatch confirmation emails to customer and admin (awaited for serverless compatibility)
      const orderData = updated || existing;
      try {
        await sendOrderConfirmationEmails({
          order: orderData,
          paymentId: razorpay_payment_id,
        });
      } catch (err) {
        console.error("[verify-payment] Error dispatching order emails:", err);
      }

      return NextResponse.json({
        success: true,
        message: "Order payment verified and confirmed successfully.",
        order: updated,
      });
    }

    // Fallback: If entityType was not passed, detect from order_id prefix or lookup
    const bkg = await getBookingByRazorpayOrderId(razorpay_order_id);
    if (bkg) {
      const updated = await markBookingPaymentPaid({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });
      try {
        await sendBookingConfirmationEmails({
          booking: updated || bkg,
          paymentId: razorpay_payment_id,
        });
      } catch (err) {
        console.error("[verify-payment fallback] Email error:", err);
      }
      return NextResponse.json({ success: true, message: "Payment verified successfully." });
    }

    const ord = await getOrderByRazorpayOrderId(razorpay_order_id);
    if (ord) {
      const updated = await markOrderPaymentPaid({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });
      try {
        await sendOrderConfirmationEmails({
          order: updated || ord,
          paymentId: razorpay_payment_id,
        });
      } catch (err) {
        console.error("[verify-payment fallback] Email error:", err);
      }
      return NextResponse.json({ success: true, message: "Payment verified successfully." });
    }

    return NextResponse.json({
      success: true,
      message: "Payment signature valid.",
    });
  } catch (error: unknown) {
    console.error("Payment verification server error:", error);
    const msg = error instanceof Error ? error.message : "An internal error occurred during payment verification.";
    return NextResponse.json(
      {
        success: false,
        message: msg,
      },
      { status: 500 }
    );
  }
}
