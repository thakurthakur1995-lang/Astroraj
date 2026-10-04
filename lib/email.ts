import nodemailer from "nodemailer";
import { BookingRecord, OrderRecord } from "@/lib/types";

// Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "thakur.thakur1995@gmail.com";
const FROM_NAME = "Astro Raj | Vedic Astrology";

function getTransporter() {
  const user = (process.env.GMAIL_USER || ADMIN_EMAIL).trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").trim();

  if (!pass) {
    console.warn(
      "[Email Service] GMAIL_APP_PASSWORD is not configured. Email will not be sent. Please set GMAIL_APP_PASSWORD in environment variables."
    );
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Direct SSL handshake for serverless environments (faster & reliable on Vercel)
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000, // 10s connection timeout
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

// Memory cache to prevent duplicate email dispatches
const sentEmailsCache = new Set<string>();

// ============================================================================
// 1. BOOKING CONFIRMATION EMAILS (CUSTOMER + ADMIN)
// ============================================================================

export async function sendBookingConfirmationEmails(params: {
  booking: BookingRecord;
  paymentId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { booking, paymentId } = params;
  const effectivePaymentId = paymentId || booking.razorpayPaymentId || booking.paymentId || "N/A";

  const cacheKey = `booking_${booking.razorpayOrderId || booking.bookingCode}`;
  if (sentEmailsCache.has(cacheKey)) {
    console.log(`[Email Service] Emails already dispatched for ${cacheKey}. Skipping duplicate.`);
    return { success: true };
  }
  sentEmailsCache.add(cacheKey);

  const transporter = getTransporter();

  if (!transporter) {
    return {
      success: false,
      error: "GMAIL_APP_PASSWORD not configured on server.",
    };
  }

  const senderUser = (process.env.GMAIL_USER || ADMIN_EMAIL).trim();
  const fromHeader = `"${FROM_NAME}" <${senderUser}>`;

  // --- Customer Email HTML ---
  const customerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed - Astro Raj</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #111827; border: 1px solid #374151; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); padding: 35px 30px; text-align: center; border-bottom: 2px solid #f59e0b;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #fbbf24; letter-spacing: 1px;">
                ASTRO RAJ
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 14px; color: #e0e7ff; letter-spacing: 0.5px;">
                Vedic Astrology & Spiritual Guidance • Rishikesh
              </p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 28px 30px 10px 30px; text-align: center;">
              <div style="display: inline-block; background-color: #064e3b; border: 1px solid #059669; color: #34d399; font-size: 13px; font-weight: 700; padding: 6px 18px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">
                ✓ Payment Verified & Booking Confirmed
              </div>
              <h2 style="margin: 20px 0 10px 0; font-size: 22px; color: #ffffff;">
                Hari Om, ${escapeHtml(booking.fullName)}!
              </h2>
              <p style="margin: 0; font-size: 15px; color: #9ca3af; line-height: 1.6;">
                Aapki consultation booking safaltapoorvak confirm ho gayi hai. Guruji and team aapki kundli analyze karne ke liye taiyar hain.
              </p>
            </td>
          </tr>

          <!-- Booking Summary Card -->
          <tr>
            <td style="padding: 20px 30px;">
              <table role="presentation" width="100%" style="background-color: #1f2937; border-radius: 12px; border: 1px solid #374151; border-collapse: separate; border-spacing: 0;">
                <tr>
                  <td colspan="2" style="padding: 14px 20px; background-color: #111827; border-bottom: 1px solid #374151; border-top-left-radius: 12px; border-top-right-radius: 12px;">
                    <strong style="color: #fbbf24; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Booking Information</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 20px; color: #9ca3af; font-size: 14px; border-bottom: 1px solid #2d3748; width: 40%;">Booking ID:</td>
                  <td style="padding: 12px 20px; color: #f9fafb; font-size: 14px; font-weight: 700; border-bottom: 1px solid #2d3748;">${escapeHtml(booking.bookingCode)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 20px; color: #9ca3af; font-size: 14px; border-bottom: 1px solid #2d3748;">Service:</td>
                  <td style="padding: 12px 20px; color: #f9fafb; font-size: 14px; font-weight: 600; border-bottom: 1px solid #2d3748;">${escapeHtml(booking.serviceTitle)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 20px; color: #9ca3af; font-size: 14px; border-bottom: 1px solid #2d3748;">Consultation Type:</td>
                  <td style="padding: 12px 20px; color: #f9fafb; font-size: 14px; border-bottom: 1px solid #2d3748; text-transform: capitalize;">${escapeHtml(booking.consultationType)} Consultation (${booking.durationMinutes} Minutes)</td>
                </tr>
                <tr>
                  <td style="padding: 12px 20px; color: #9ca3af; font-size: 14px; border-bottom: 1px solid #2d3748;">Scheduled Date:</td>
                  <td style="padding: 12px 20px; color: #f9fafb; font-size: 14px; font-weight: 600; border-bottom: 1px solid #2d3748;">${escapeHtml(booking.date)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 20px; color: #9ca3af; font-size: 14px; border-bottom: 1px solid #2d3748;">Time Slot:</td>
                  <td style="padding: 12px 20px; color: #f9fafb; font-size: 14px; font-weight: 600; border-bottom: 1px solid #2d3748;">${escapeHtml(booking.timeSlot)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 20px; color: #9ca3af; font-size: 14px; border-bottom: 1px solid #2d3748;">Payment ID:</td>
                  <td style="padding: 12px 20px; color: #38bdf8; font-size: 13px; font-family: monospace; border-bottom: 1px solid #2d3748;">${escapeHtml(effectivePaymentId)}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; color: #9ca3af; font-size: 15px; font-weight: 700;">Amount Paid:</td>
                  <td style="padding: 14px 20px; color: #34d399; font-size: 18px; font-weight: 800;">₹${booking.price.toLocaleString("en-IN")}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Instructions Card -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <div style="background-color: #1e1b4b; border: 1px solid #3730a3; border-radius: 12px; padding: 18px 20px;">
                <h4 style="margin: 0 0 8px 0; color: #c7d2fe; font-size: 14px;">Next Steps / Agle Kadam:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #e0e7ff; font-size: 13px; line-height: 1.6;">
                  <li>Aapke scheduled time par Guruji ya humari team aapse WhatsApp ya Phone call par connect karegi.</li>
                  <li>Agar aapka Video session hai, toh meeting link aapke WhatsApp number par share kiya jayega.</li>
                  <li>Kripya apne janam vivaran (DOB, Time, Place) ke sath samay par uplabdh rahein.</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d1117; padding: 25px 30px; text-align: center; border-top: 1px solid #374151;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #fbbf24;">
                Astro Raj • Vedic Astrology & Spiritual Guidance
              </p>
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #9ca3af;">
                Shisham Jhari, Muni Ki Reti, Rishikesh, Uttarakhand 249137
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                WhatsApp / Call: <a href="https://wa.me/916398754093" style="color: #60a5fa; text-decoration: none;">+91 6398-754093</a> | Email: <a href="mailto:info@astroraj.org" style="color: #60a5fa; text-decoration: none;">info@astroraj.org</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // --- Admin Email HTML ---
  const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Booking Notification - Astro Raj</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 25px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 650px; background-color: #111827; border: 1px solid #4b5563; border-radius: 14px; overflow: hidden;">
          
          <!-- Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #b45309 0%, #d97706 100%); padding: 24px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">
                🔔 NAYI CONSULTATION BOOKING AAYI HAI!
              </h2>
              <p style="margin: 6px 0 0 0; color: #fef3c7; font-size: 14px;">
                Payment Paid & Verified • Booking Code: ${escapeHtml(booking.bookingCode)}
              </p>
            </td>
          </tr>

          <!-- Client Personal & Birth Details -->
          <tr>
            <td style="padding: 25px 25px 10px 25px;">
              <h3 style="margin: 0 0 14px 0; color: #fbbf24; font-size: 16px; border-bottom: 2px solid #374151; padding-bottom: 6px;">
                👤 Client Information & Birth Details
              </h3>
              <table role="presentation" width="100%" style="font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af; width: 38%;">Full Name:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${escapeHtml(booking.fullName)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Mobile Phone:</td>
                  <td style="padding: 8px 0; color: #38bdf8; font-weight: 700;">
                    <a href="tel:${escapeHtml(booking.phone)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(booking.phone)}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">WhatsApp Number:</td>
                  <td style="padding: 8px 0; color: #34d399; font-weight: 700;">
                    <a href="https://wa.me/${escapeHtml(booking.whatsappNumber || booking.phone)}" style="color: #34d399; text-decoration: none;">${escapeHtml(booking.whatsappNumber || booking.phone)}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Email:</td>
                  <td style="padding: 8px 0; color: #ffffff;">
                    <a href="mailto:${escapeHtml(booking.email)}" style="color: #60a5fa; text-decoration: none;">${escapeHtml(booking.email)}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Gender:</td>
                  <td style="padding: 8px 0; color: #ffffff; text-transform: capitalize;">${escapeHtml(booking.gender || "Not specified")}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #fbbf24; font-weight: 600;">Date of Birth (DOB):</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${escapeHtml(booking.dateOfBirth)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #fbbf24; font-weight: 600;">Time of Birth:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">
                    ${escapeHtml(booking.timeOfBirth)} ${booking.timeIsApproximate ? '<span style="color: #f59e0b; font-size: 12px;">(Approximate)</span>' : ""}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #fbbf24; font-weight: 600;">Place of Birth:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${escapeHtml(booking.placeOfBirth)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Preferred Language:</td>
                  <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(booking.preferredLanguage || "Hindi")}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Concern / Topic:</td>
                  <td style="padding: 8px 0; color: #fbbf24; font-weight: 700;">${escapeHtml(booking.concernsTopic || "General Consultation")}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; vertical-align: top;">Questions / Notes:</td>
                  <td style="padding: 8px 0; color: #e5e7eb; line-height: 1.5;">${escapeHtml(booking.questionOrNotes || "None provided")}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Slot & Payment Details -->
          <tr>
            <td style="padding: 10px 25px 25px 25px;">
              <h3 style="margin: 0 0 14px 0; color: #fbbf24; font-size: 16px; border-bottom: 2px solid #374151; padding-bottom: 6px;">
                💳 Slot & Payment Details
              </h3>
              <table role="presentation" width="100%" style="font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af; width: 38%;">Service:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${escapeHtml(booking.serviceTitle)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Mode & Duration:</td>
                  <td style="padding: 8px 0; color: #ffffff; text-transform: capitalize;">${escapeHtml(booking.consultationType)} (${booking.durationMinutes} mins) - ${booking.urgency === "urgent" ? '<span style="color: #ef4444; font-weight: 700;">URGENT (24H)</span>' : "Normal"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Date & Slot:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${escapeHtml(booking.date)} | ${escapeHtml(booking.timeSlot)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Razorpay Order ID:</td>
                  <td style="padding: 8px 0; color: #9ca3af; font-family: monospace;">${escapeHtml(booking.razorpayOrderId || "N/A")}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Razorpay Payment ID:</td>
                  <td style="padding: 8px 0; color: #38bdf8; font-family: monospace; font-weight: 700;">${escapeHtml(effectivePaymentId)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #9ca3af; font-weight: 700;">Amount Received:</td>
                  <td style="padding: 10px 0; color: #34d399; font-size: 18px; font-weight: 800;">₹${booking.price.toLocaleString("en-IN")} (PAID)</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const promises = [];

    // 1. Send to Customer
    if (booking.email) {
      promises.push(
        transporter.sendMail({
          from: fromHeader,
          to: booking.email,
          subject: `Booking Confirmed: ${booking.serviceTitle} | Astro Raj (${booking.bookingCode})`,
          html: customerHtml,
        }).catch((err) => {
          console.error(`[Email Service] Failed sending customer booking email to ${booking.email}:`, err);
        })
      );
    }

    // 2. Send to Admin
    promises.push(
      transporter.sendMail({
        from: fromHeader,
        to: ADMIN_EMAIL,
        subject: `🔔 [NEW BOOKING] ${booking.serviceTitle} - ${booking.fullName} (₹${booking.price})`,
        html: adminHtml,
      }).catch((err) => {
        console.error(`[Email Service] Failed sending admin booking email to ${ADMIN_EMAIL}:`, err);
      })
    );

    await Promise.allSettled(promises);
    console.log(`[Email Service] Booking confirmation emails dispatched for ${booking.bookingCode}`);
    return { success: true };
  } catch (error) {
    console.error("[Email Service] Error in sendBookingConfirmationEmails:", error);
    return { success: false, error: String(error) };
  }
}

// ============================================================================
// 2. PRODUCT SHOP ORDER CONFIRMATION EMAILS (CUSTOMER + ADMIN)
// ============================================================================

export async function sendOrderConfirmationEmails(params: {
  order: OrderRecord;
  paymentId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { order, paymentId } = params;
  const effectivePaymentId = paymentId || order.razorpayPaymentId || order.paymentId || "N/A";

  const cacheKey = `order_${order.razorpayOrderId || order.orderNumber}`;
  if (sentEmailsCache.has(cacheKey)) {
    console.log(`[Email Service] Emails already dispatched for ${cacheKey}. Skipping duplicate.`);
    return { success: true };
  }
  sentEmailsCache.add(cacheKey);

  const transporter = getTransporter();

  if (!transporter) {
    return {
      success: false,
      error: "GMAIL_APP_PASSWORD not configured on server.",
    };
  }

  const senderUser = (process.env.GMAIL_USER || ADMIN_EMAIL).trim();
  const fromHeader = `"${FROM_NAME}" <${senderUser}>`;

  // Defensive parsing for items
  const rawItems = order.items;
  let itemsList: { productName: string; quantity: number; price: number }[] = [];
  try {
    if (Array.isArray(rawItems)) {
      itemsList = rawItems;
    } else if (typeof rawItems === "string") {
      itemsList = JSON.parse(rawItems);
    }
  } catch (e) {
    console.error("[Email Service] Error parsing order items:", e);
  }

  // Format Items table for HTML
  const itemsHtml = (itemsList.length > 0 ? itemsList : [{ productName: "Sacred Spiritual Item", quantity: 1, price: order.total }])
    .map((item) => {
      const name = item.productName || "Sacred Item";
      const qty = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      return `
    <tr style="border-bottom: 1px solid #2d3748;">
      <td style="padding: 12px 14px; color: #f9fafb; font-size: 14px;">
        <strong>${escapeHtml(name)}</strong>
      </td>
      <td style="padding: 12px 14px; color: #9ca3af; font-size: 14px; text-align: center;">${qty}</td>
      <td style="padding: 12px 14px; color: #f9fafb; font-size: 14px; text-align: right;">₹${price.toLocaleString("en-IN")}</td>
      <td style="padding: 12px 14px; color: #34d399; font-size: 14px; font-weight: 700; text-align: right;">₹${(price * qty).toLocaleString("en-IN")}</td>
    </tr>
  `;
    })
    .join("");

  // Defensive parsing for shipping address
  let shipping = order.customer.shippingAddress;
  if (typeof shipping === "string") {
    try {
      shipping = JSON.parse(shipping);
    } catch {
      shipping = { street: String(shipping) } as any;
    }
  }
  const formattedAddress = shipping
    ? [shipping.street, shipping.city, shipping.state, shipping.postalCode, shipping.country]
        .filter(Boolean)
        .map(escapeHtml)
        .join(", ")
    : "Not provided";

  // --- Customer Order Email ---
  const customerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Order Confirmed - Astro Raj</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #111827; border: 1px solid #374151; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); padding: 35px 30px; text-align: center; border-bottom: 2px solid #f59e0b;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #fbbf24; letter-spacing: 1px;">
                ASTRO RAJ
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 14px; color: #e0e7ff;">
                Authentic Vedic Gemstones & Spiritual Items • Rishikesh
              </p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 28px 30px 10px 30px; text-align: center;">
              <div style="display: inline-block; background-color: #064e3b; border: 1px solid #059669; color: #34d399; font-size: 13px; font-weight: 700; padding: 6px 18px; border-radius: 9999px; text-transform: uppercase;">
                ✓ Payment Received & Order Confirmed
              </div>
              <h2 style="margin: 20px 0 10px 0; font-size: 22px; color: #ffffff;">
                Dhanyawad, ${escapeHtml(order.customer.fullName)}!
              </h2>
              <p style="margin: 0; font-size: 15px; color: #9ca3af; line-height: 1.6;">
                Aapka order safaltapoorvak place ho gaya hai. Hum aapke sacred items ko Vedic vidhi se energize karke dispatch karenge.
              </p>
            </td>
          </tr>

          <!-- Items Ordered Table -->
          <tr>
            <td style="padding: 20px 30px;">
              <table role="presentation" width="100%" style="background-color: #1f2937; border-radius: 12px; border: 1px solid #374151; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #111827; border-bottom: 1px solid #374151;">
                    <th style="padding: 12px 14px; text-align: left; color: #fbbf24; font-size: 13px; text-transform: uppercase;">Item</th>
                    <th style="padding: 12px 14px; text-align: center; color: #fbbf24; font-size: 13px; text-transform: uppercase;">Qty</th>
                    <th style="padding: 12px 14px; text-align: right; color: #fbbf24; font-size: 13px; text-transform: uppercase;">Price</th>
                    <th style="padding: 12px 14px; text-align: right; color: #fbbf24; font-size: 13px; text-transform: uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr>
                    <td colspan="3" style="padding: 10px 14px; text-align: right; color: #9ca3af; font-size: 13px;">Subtotal:</td>
                    <td style="padding: 10px 14px; text-align: right; color: #f9fafb; font-size: 13px;">₹${order.subtotal.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding: 10px 14px; text-align: right; color: #9ca3af; font-size: 13px;">Shipping:</td>
                    <td style="padding: 10px 14px; text-align: right; color: #f9fafb; font-size: 13px;">${order.shippingFee > 0 ? `₹${order.shippingFee}` : "FREE"}</td>
                  </tr>
                  <tr style="border-top: 1px solid #374151;">
                    <td colspan="3" style="padding: 14px 14px; text-align: right; color: #fbbf24; font-size: 15px; font-weight: 700;">Grand Total:</td>
                    <td style="padding: 14px 14px; text-align: right; color: #34d399; font-size: 18px; font-weight: 800;">₹${order.total.toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Shipping & Order Info -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <table role="presentation" width="100%" style="background-color: #1f2937; border-radius: 12px; border: 1px solid #374151; padding: 18px 20px;">
                <tr>
                  <td style="color: #9ca3af; font-size: 13px; padding-bottom: 6px; width: 35%;">Order Number:</td>
                  <td style="color: #ffffff; font-size: 14px; font-weight: 700; padding-bottom: 6px;">${escapeHtml(order.orderNumber)}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; font-size: 13px; padding-bottom: 6px;">Payment ID:</td>
                  <td style="color: #38bdf8; font-size: 13px; font-family: monospace; padding-bottom: 6px;">${escapeHtml(effectivePaymentId)}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; font-size: 13px; vertical-align: top;">Shipping Address:</td>
                  <td style="color: #e5e7eb; font-size: 13px; line-height: 1.5;">${formattedAddress}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d1117; padding: 25px 30px; text-align: center; border-top: 1px solid #374151;">
              <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #fbbf24;">
                Astro Raj • Authentic Spiritual Shop
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                WhatsApp / Call: <a href="https://wa.me/916398754093" style="color: #60a5fa; text-decoration: none;">+91 6398-754093</a> | Email: <a href="mailto:info@astroraj.org" style="color: #60a5fa; text-decoration: none;">info@astroraj.org</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // --- Admin Order Email ---
  const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Shop Order - Astro Raj</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 25px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 650px; background-color: #111827; border: 1px solid #4b5563; border-radius: 14px; overflow: hidden;">
          
          <!-- Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #047857 0%, #059669 100%); padding: 24px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">
                📦 NAYA PRODUCT ORDER AAYA HAI!
              </h2>
              <p style="margin: 6px 0 0 0; color: #d1fae5; font-size: 14px;">
                Order #${escapeHtml(order.orderNumber)} • Total: ₹${order.total.toLocaleString("en-IN")} (PAID)
              </p>
            </td>
          </tr>

          <!-- Customer & Shipping Details -->
          <tr>
            <td style="padding: 25px 25px 10px 25px;">
              <h3 style="margin: 0 0 14px 0; color: #fbbf24; font-size: 16px; border-bottom: 2px solid #374151; padding-bottom: 6px;">
                👤 Customer & Shipping Information
              </h3>
              <table role="presentation" width="100%" style="font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af; width: 35%;">Customer Name:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${escapeHtml(order.customer.fullName)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Mobile Phone:</td>
                  <td style="padding: 8px 0; color: #38bdf8; font-weight: 700;">
                    <a href="tel:${escapeHtml(order.customer.phone)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(order.customer.phone)}</a>
                    &nbsp;|&nbsp;
                    <a href="https://wa.me/${escapeHtml(order.customer.phone.replace(/[^0-9]/g, ""))}" style="color: #34d399; text-decoration: none;">WhatsApp</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #9ca3af;">Email:</td>
                  <td style="padding: 8px 0; color: #ffffff;">
                    <a href="mailto:${escapeHtml(order.customer.email)}" style="color: #60a5fa; text-decoration: none;">${escapeHtml(order.customer.email)}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px 0; color: #fbbf24; vertical-align: top; font-weight: 600;">Delivery Address:</td>
                  <td style="padding: 8px 0; color: #ffffff; line-height: 1.5; font-weight: 600;">
                    ${formattedAddress}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; vertical-align: top;">Order Notes:</td>
                  <td style="padding: 8px 0; color: #e5e7eb;">${escapeHtml(order.customer.orderNotes || "None")}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 10px 25px 25px 25px;">
              <h3 style="margin: 0 0 14px 0; color: #fbbf24; font-size: 16px; border-bottom: 2px solid #374151; padding-bottom: 6px;">
                📦 Items To Dispatch
              </h3>
              <table role="presentation" width="100%" style="background-color: #1f2937; border-radius: 8px; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #111827; border-bottom: 1px solid #374151;">
                    <th style="padding: 10px 12px; text-align: left; color: #fbbf24; font-size: 13px;">Item</th>
                    <th style="padding: 10px 12px; text-align: center; color: #fbbf24; font-size: 13px;">Qty</th>
                    <th style="padding: 10px 12px; text-align: right; color: #fbbf24; font-size: 13px;">Price</th>
                    <th style="padding: 10px 12px; text-align: right; color: #fbbf24; font-size: 13px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <table role="presentation" width="100%" style="margin-top: 15px; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af;">Razorpay Order ID:</td>
                  <td style="padding: 6px 0; color: #ffffff; font-family: monospace;">${escapeHtml(order.razorpayOrderId || "N/A")}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af;">Razorpay Payment ID:</td>
                  <td style="padding: 6px 0; color: #38bdf8; font-family: monospace; font-weight: 700;">${escapeHtml(effectivePaymentId)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; font-weight: 700;">Grand Total Paid:</td>
                  <td style="padding: 6px 0; color: #34d399; font-size: 18px; font-weight: 800;">₹${order.total.toLocaleString("en-IN")}</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const promises = [];

    // 1. Send to Customer
    if (order.customer.email) {
      promises.push(
        transporter.sendMail({
          from: fromHeader,
          to: order.customer.email,
          subject: `Order Confirmed: #${order.orderNumber} | Astro Raj`,
          html: customerHtml,
        }).catch((err) => {
          console.error(`[Email Service] Failed sending customer order email to ${order.customer.email}:`, err);
        })
      );
    }

    // 2. Send to Admin
    promises.push(
      transporter.sendMail({
        from: fromHeader,
        to: ADMIN_EMAIL,
        subject: `📦 [NEW ORDER] #${order.orderNumber} - ${order.customer.fullName} (₹${order.total})`,
        html: adminHtml,
      }).catch((err) => {
        console.error(`[Email Service] Failed sending admin order email to ${ADMIN_EMAIL}:`, err);
      })
    );

    await Promise.allSettled(promises);
    console.log(`[Email Service] Order confirmation emails dispatched for #${order.orderNumber}`);
    return { success: true };
  } catch (error) {
    console.error("[Email Service] Error in sendOrderConfirmationEmails:", error);
    return { success: false, error: String(error) };
  }
}

// Helper function to escape HTML special characters to prevent injection
function escapeHtml(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// 3. TEST EMAIL DISPATCH (FOR VERIFICATION)
// ============================================================================

export async function sendTestEmail(targetEmail?: string): Promise<{ success: boolean; message: string }> {
  const transporter = getTransporter();
  const recipient = targetEmail || ADMIN_EMAIL;

  if (!transporter) {
    return {
      success: false,
      message: "GMAIL_APP_PASSWORD is not configured in .env.local. Please add your 16-character Google App Password.",
    };
  }

  const senderUser = (process.env.GMAIL_USER || ADMIN_EMAIL).trim();

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${senderUser}>`,
      to: recipient,
      subject: `🧪 Test Email from Astro Raj SMTP Service`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155; max-width: 500px;">
          <h2 style="margin-top: 0; color: #fbbf24; font-size: 20px;">Astro Raj Email Service Test</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
            Hari Om! Aapka Gmail SMTP integration successfully connect ho gaya hai aur emails dispatch hone ke liye bilkul taiyar hain.
          </p>
          <div style="background: #1e293b; padding: 12px 16px; border-radius: 8px; margin: 16px 0; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Sender:</strong> ${escapeHtml(senderUser)}</p>
            <p style="margin: 4px 0;"><strong>Receiver:</strong> ${escapeHtml(recipient)}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> Connected & Verified</p>
          </div>
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            Jab bhi koi booking ya order paid hoga, automatic customer aur admin confirmation emails trigger ho jayenge.
          </p>
        </div>
      `,
    });
    return {
      success: true,
      message: `Test email successfully sent to ${recipient}!`,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to send email: ${errorMsg}`,
    };
  }
}

