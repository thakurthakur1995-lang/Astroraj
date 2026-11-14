import nodemailer, { type SendMailOptions } from "nodemailer";
import { BookingRecord, OrderRecord } from "@/lib/types";

// Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "thakur.thakur1995@gmail.com";
const FROM_NAME = "Astro Raj | Vedic Astrology";

function getSmtpCredentials() {
  const user = (process.env.GMAIL_USER || ADMIN_EMAIL || "thakur.thakur1995@gmail.com").trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").trim();
  return { user, pass };
}

// Resilient Multi-Provider Mail Sender:
// 1. If RESEND_API_KEY is configured -> sends over HTTPS Port 443 (100% bypasses DigitalOcean SMTP port blocks)
//    Note: If using unverified test domain (onboarding@resend.dev), Resend strictly only allows sending to the account owner.
//    For external customer recipients, it automatically skips/falls back to SMTP.
// 2. If BREVO_API_KEY is configured -> sends over HTTPS Port 443
// 3. Fallback: Direct SMTP (Port 465 SSL -> Port 587 STARTTLS) with forced IPv4
export async function sendMailWithFallback(mailOptions: SendMailOptions): Promise<{ provider: string }> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  const emailProviderPref = process.env.EMAIL_PROVIDER?.trim().toLowerCase();

  const rawRecipient = Array.isArray(mailOptions.to)
    ? mailOptions.to[0]
    : mailOptions.to;

  const toRecipient: string = typeof rawRecipient === "string"
    ? rawRecipient
    : typeof rawRecipient === "object" && rawRecipient && "address" in rawRecipient
      ? String((rawRecipient as any).address)
      : String(rawRecipient || "");

  const { user, pass } = getSmtpCredentials();
  const recipientClean = toRecipient.trim().toLowerCase();
  const adminClean = (ADMIN_EMAIL || "").trim().toLowerCase();
  const userClean = (user || "").trim().toLowerCase();
  const isOwnerRecipient = recipientClean === adminClean || recipientClean === userClean;

  const errors: string[] = [];

  // Provider: Direct SMTP (Gmail)
  const trySmtp = async (): Promise<boolean> => {
    if (!pass) {
      errors.push("Gmail SMTP: GMAIL_APP_PASSWORD is not configured");
      return false;
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const primaryPort = Number(process.env.SMTP_PORT || 465);

    // 1. Try Primary: Port 465 (Direct SSL) with forced IPv4
    try {
      const primaryTransporter = nodemailer.createTransport({
        host,
        port: primaryPort,
        secure: primaryPort === 465,
        family: 4,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 8000,
        socketTimeout: 12000,
        tls: {
          rejectUnauthorized: true,
          servername: host,
        },
      } as any);

      await primaryTransporter.sendMail({
        ...mailOptions,
        from: mailOptions.from || `"${FROM_NAME}" <${user}>`,
      });
      console.log(`[Email Service] Email dispatched successfully via Gmail SMTP (Port ${primaryPort}) to ${toRecipient}`);
      return true;
    } catch (primaryErr: any) {
      const pMsg = primaryErr?.message || String(primaryErr);
      console.warn(
        `[Email Service] Primary SMTP port ${primaryPort} failed (${pMsg}). Retrying via Port 587 (STARTTLS)...`
      );

      // 2. Fallback: Port 587 (STARTTLS) with forced IPv4
      try {
        const fallbackTransporter = nodemailer.createTransport({
          host,
          port: 587,
          secure: false, // STARTTLS
          family: 4,
          auth: { user, pass },
          connectionTimeout: 10000,
          greetingTimeout: 8000,
          socketTimeout: 12000,
          tls: {
            rejectUnauthorized: true,
            servername: host,
          },
        } as any);

        await fallbackTransporter.sendMail({
          ...mailOptions,
          from: mailOptions.from || `"${FROM_NAME}" <${user}>`,
        });
        console.log(`[Email Service] Email dispatched successfully via Gmail SMTP (Port 587) to ${toRecipient}`);
        return true;
      } catch (fallbackErr: any) {
        const fMsg = fallbackErr?.message || String(fallbackErr);
        console.error(`[Email Service] Both SMTP ports (465 & 587) failed to deliver to ${toRecipient}: ${fMsg}`);
        errors.push(`Gmail SMTP failed (Ports 465/587): ${fMsg}`);
        return false;
      }
    }
  };

  // Provider: Resend HTTP API
  const tryResend = async (): Promise<boolean> => {
    if (!resendApiKey) return false;

    const fromAddress = process.env.RESEND_FROM_EMAIL || "Astro Raj <onboarding@resend.dev>";
    const isTestingDomain = fromAddress.includes("@resend.dev");

    // Resend free test domain restriction:
    // onboarding@resend.dev strictly only permits sending to the account owner email.
    // If recipient is an external customer and fromAddress is testing domain, Resend will ALWAYS fail with 403.
    if (isTestingDomain && !isOwnerRecipient) {
      console.log(
        `[Email Service] Skipping Resend for external customer ${toRecipient} because fromAddress (${fromAddress}) is unverified test domain. Resend sandbox only permits sending to owner (${adminClean}). Falling back to SMTP...`
      );
      errors.push(`Resend skipped: test domain (${fromAddress}) cannot send to external customer (${toRecipient})`);
      return false;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [toRecipient],
          subject: mailOptions.subject,
          html: mailOptions.html,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMsg = `Resend API error (${response.status}): ${data.message || JSON.stringify(data)}`;
        console.warn(`[Email Service] ${errorMsg}. Falling back to next provider...`);
        errors.push(errorMsg);
        return false;
      }

      console.log(`[Email Service] Email dispatched successfully via Resend API to ${toRecipient}`);
      return true;
    } catch (resendErr: any) {
      const rMsg = resendErr?.message || String(resendErr);
      console.warn(`[Email Service] Resend network error (${rMsg}). Falling back to next provider...`);
      errors.push(`Resend error: ${rMsg}`);
      return false;
    }
  };

  // Provider: Brevo HTTP API
  const tryBrevo = async (): Promise<boolean> => {
    if (!brevoApiKey) return false;

    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.GMAIL_USER || ADMIN_EMAIL;
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: FROM_NAME, email: senderEmail },
          to: [{ email: toRecipient }],
          subject: mailOptions.subject,
          htmlContent: mailOptions.html,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMsg = `Brevo API error (${response.status}): ${data.message || JSON.stringify(data)}`;
        console.warn(`[Email Service] ${errorMsg}. Falling back to next provider...`);
        errors.push(errorMsg);
        return false;
      }

      console.log(`[Email Service] Email dispatched successfully via Brevo API to ${toRecipient}`);
      return true;
    } catch (brevoErr: any) {
      const bMsg = brevoErr?.message || String(brevoErr);
      console.warn(`[Email Service] Brevo network error (${bMsg}). Falling back to next provider...`);
      errors.push(`Brevo error: ${bMsg}`);
      return false;
    }
  };

  // Provider Selection Strategy
  if (emailProviderPref === "smtp") {
    if (await trySmtp()) return { provider: "Gmail SMTP" };
    if (await tryResend()) return { provider: "Resend HTTP API" };
    if (await tryBrevo()) return { provider: "Brevo HTTP API" };
  } else {
    if (await tryResend()) return { provider: "Resend HTTP API" };
    if (await tryBrevo()) return { provider: "Brevo HTTP API" };
    if (await trySmtp()) return { provider: "Gmail SMTP" };
  }

  // All providers failed
  const failureMsg = `[Email Service] All email delivery providers failed for recipient ${toRecipient}. Attempts: ${errors.join(" | ")}`;
  console.error(failureMsg);
  throw new Error(failureMsg);
}

// Memory cache & concurrency lock to prevent duplicate email dispatches
const sentEmailsCache = new Set<string>();
const inFlightEmailDispatches = new Map<string, Promise<{ success: boolean; error?: string }>>();

// ============================================================================
// 1. BOOKING CONFIRMATION EMAILS (CUSTOMER + ADMIN)
// ============================================================================

export async function sendBookingConfirmationEmails(params: {
  booking: BookingRecord;
  paymentId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { booking, paymentId } = params;
  const effectivePaymentId = paymentId || booking.razorpayPaymentId || booking.paymentId || "N/A";

  // Build all deduplication keys
  const keys: string[] = [];
  if (booking.razorpayOrderId) keys.push(`booking_rzp_${booking.razorpayOrderId.trim()}`);
  if (booking.bookingCode) keys.push(`booking_code_${booking.bookingCode.trim()}`);
  if (booking.id) keys.push(`booking_id_${booking.id.trim()}`);
  if (effectivePaymentId && effectivePaymentId !== "N/A" && effectivePaymentId !== "webhook_captured") {
    keys.push(`booking_pay_${effectivePaymentId.trim()}`);
  }

  // 1. Deduplication check: Has email already been sent for this booking?
  for (const k of keys) {
    if (sentEmailsCache.has(k)) {
      console.log(`[Email Service] Booking emails already dispatched for (${k}). Skipping duplicate.`);
      return { success: true };
    }
  }

  // 2. Concurrency lock (Mutex): If currently dispatching, await the same promise
  const lockKey = keys[0] || `booking_${booking.bookingCode || Date.now()}`;
  if (inFlightEmailDispatches.has(lockKey)) {
    console.log(`[Email Service] Booking email dispatch already in-flight for ${lockKey}. Waiting...`);
    return inFlightEmailDispatches.get(lockKey)!;
  }

  const dispatchPromise = (async (): Promise<{ success: boolean; error?: string }> => {
    // Tentatively add keys to cache to prevent concurrent triggers
    keys.forEach((k) => sentEmailsCache.add(k));

    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const brevoApiKey = process.env.BREVO_API_KEY?.trim();
    const { user, pass } = getSmtpCredentials();
    if (!pass && !resendApiKey && !brevoApiKey) {
      keys.forEach((k) => sentEmailsCache.delete(k));
      console.warn("[Email Service] No email service configured on server (Neither GMAIL_APP_PASSWORD, RESEND_API_KEY nor BREVO_API_KEY).");
      return {
        success: false,
        error: "No email service configured on server.",
      };
    }

    const fromHeader = `"${FROM_NAME}" <${user}>`;

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
      const sendPromises: Promise<any>[] = [];
      const customerEmail = booking.email?.trim();

      // 1. Send to Customer
      if (customerEmail) {
        sendPromises.push(
          sendMailWithFallback({
            from: fromHeader,
            to: customerEmail,
            subject: `Booking Confirmed: ${booking.serviceTitle} | Astro Raj (${booking.bookingCode})`,
            html: customerHtml,
          }).catch((err) => {
            console.error(`[Email Service] Failed sending customer booking email to ${customerEmail}:`, err);
            throw err;
          })
        );
      }

      // 2. Send to Admin
      sendPromises.push(
        sendMailWithFallback({
          from: fromHeader,
          to: ADMIN_EMAIL,
          subject: `🔔 [NEW BOOKING] ${booking.serviceTitle} - ${booking.fullName} (₹${booking.price})`,
          html: adminHtml,
        }).catch((err) => {
          console.error(`[Email Service] Failed sending admin booking email to ${ADMIN_EMAIL}:`, err);
          throw err;
        })
      );

      const results = await Promise.allSettled(sendPromises);
      const customerIdx = customerEmail ? 0 : -1;
      const adminIdx = customerEmail ? 1 : 0;

      const customerFailed = customerIdx !== -1 && results[customerIdx]?.status === "rejected";
      const adminFailed = results[adminIdx]?.status === "rejected";

      if (customerFailed) {
        console.error(
          `[Email Service] Customer booking email failed:`,
          (results[customerIdx] as PromiseRejectedResult).reason
        );
      }
      if (adminFailed) {
        console.error(
          `[Email Service] Admin booking email failed:`,
          (results[adminIdx] as PromiseRejectedResult).reason
        );
      }

      const hasSuccess = results.some((r) => r.status === "fulfilled");

      if (hasSuccess) {
        // If customer email failed, release lock from cache so retries can redeliver
        if (customerFailed) {
          keys.forEach((k) => sentEmailsCache.delete(k));
        }
        console.log(`[Email Service] Booking confirmation emails dispatched for ${booking.bookingCode} (Customer: ${customerFailed ? "FAILED" : "SENT"}, Admin: ${adminFailed ? "FAILED" : "SENT"})`);
        return { success: true };
      } else {
        // Unlock on complete failure
        keys.forEach((k) => sentEmailsCache.delete(k));
        const rejected = results.find((r) => r.status === "rejected");
        return { success: false, error: String(rejected?.reason || "Failed to dispatch booking emails") };
      }
    } catch (error) {
      keys.forEach((k) => sentEmailsCache.delete(k));
      console.error("[Email Service] Error in sendBookingConfirmationEmails:", error);
      return { success: false, error: String(error) };
    } finally {
      inFlightEmailDispatches.delete(lockKey);
    }
  })();

  inFlightEmailDispatches.set(lockKey, dispatchPromise);
  return dispatchPromise;
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

  // Build all deduplication keys
  const keys: string[] = [];
  if (order.razorpayOrderId) keys.push(`order_rzp_${order.razorpayOrderId.trim()}`);
  if (order.orderNumber) keys.push(`order_num_${order.orderNumber.trim()}`);
  if (order.id) keys.push(`order_id_${order.id.trim()}`);
  if (effectivePaymentId && effectivePaymentId !== "N/A" && effectivePaymentId !== "webhook_captured") {
    keys.push(`order_pay_${effectivePaymentId.trim()}`);
  }

  // 1. Deduplication check: Has email already been sent for this order?
  for (const k of keys) {
    if (sentEmailsCache.has(k)) {
      console.log(`[Email Service] Order emails already dispatched for (${k}). Skipping duplicate.`);
      return { success: true };
    }
  }

  // 2. Concurrency lock (Mutex): If currently dispatching, await the same promise
  const lockKey = keys[0] || `order_${order.orderNumber || Date.now()}`;
  if (inFlightEmailDispatches.has(lockKey)) {
    console.log(`[Email Service] Order email dispatch already in-flight for ${lockKey}. Waiting...`);
    return inFlightEmailDispatches.get(lockKey)!;
  }

  const dispatchPromise = (async (): Promise<{ success: boolean; error?: string }> => {
    // Tentatively add keys to cache to prevent concurrent triggers
    keys.forEach((k) => sentEmailsCache.add(k));

    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const brevoApiKey = process.env.BREVO_API_KEY?.trim();
    const { user, pass } = getSmtpCredentials();
    if (!pass && !resendApiKey && !brevoApiKey) {
      keys.forEach((k) => sentEmailsCache.delete(k));
      console.warn("[Email Service] No email service configured on server (Neither GMAIL_APP_PASSWORD, RESEND_API_KEY nor BREVO_API_KEY).");
      return {
        success: false,
        error: "No email service configured on server.",
      };
    }

    const fromHeader = `"${FROM_NAME}" <${user}>`;

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
      const sendPromises: Promise<any>[] = [];
      const customerEmail = order.customer?.email?.trim();

      // 1. Send to Customer
      if (customerEmail) {
        sendPromises.push(
          sendMailWithFallback({
            from: fromHeader,
            to: customerEmail,
            subject: `Order Confirmed: #${order.orderNumber} | Astro Raj`,
            html: customerHtml,
          }).catch((err) => {
            console.error(`[Email Service] Failed sending customer order email to ${customerEmail}:`, err);
            throw err;
          })
        );
      }

      // 2. Send to Admin
      sendPromises.push(
        sendMailWithFallback({
          from: fromHeader,
          to: ADMIN_EMAIL,
          subject: `📦 [NEW ORDER] #${order.orderNumber} - ${order.customer.fullName} (₹${order.total})`,
          html: adminHtml,
        }).catch((err) => {
          console.error(`[Email Service] Failed sending admin order email to ${ADMIN_EMAIL}:`, err);
          throw err;
        })
      );

      const results = await Promise.allSettled(sendPromises);
      const customerIdx = customerEmail ? 0 : -1;
      const adminIdx = customerEmail ? 1 : 0;

      const customerFailed = customerIdx !== -1 && results[customerIdx]?.status === "rejected";
      const adminFailed = results[adminIdx]?.status === "rejected";

      if (customerFailed) {
        console.error(
          `[Email Service] Customer order email failed:`,
          (results[customerIdx] as PromiseRejectedResult).reason
        );
      }
      if (adminFailed) {
        console.error(
          `[Email Service] Admin order email failed:`,
          (results[adminIdx] as PromiseRejectedResult).reason
        );
      }

      const hasSuccess = results.some((r) => r.status === "fulfilled");

      if (hasSuccess) {
        // If customer email failed, release lock from cache so retries can redeliver
        if (customerFailed) {
          keys.forEach((k) => sentEmailsCache.delete(k));
        }
        console.log(`[Email Service] Order confirmation emails dispatched for #${order.orderNumber} (Customer: ${customerFailed ? "FAILED" : "SENT"}, Admin: ${adminFailed ? "FAILED" : "SENT"})`);
        return { success: true };
      } else {
        // Unlock on complete failure
        keys.forEach((k) => sentEmailsCache.delete(k));
        const rejected = results.find((r) => r.status === "rejected");
        return { success: false, error: String(rejected?.reason || "Failed to dispatch order emails") };
      }
    } catch (error) {
      keys.forEach((k) => sentEmailsCache.delete(k));
      console.error("[Email Service] Error in sendOrderConfirmationEmails:", error);
      return { success: false, error: String(error) };
    } finally {
      inFlightEmailDispatches.delete(lockKey);
    }
  })();

  inFlightEmailDispatches.set(lockKey, dispatchPromise);
  return dispatchPromise;
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
  const recipient = targetEmail || ADMIN_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  const { user, pass } = getSmtpCredentials();

  if (!resendApiKey && !brevoApiKey && !pass) {
    return {
      success: false,
      message: "No email service configured. Please add RESEND_API_KEY (recommended for DigitalOcean) or GMAIL_APP_PASSWORD in environment variables.",
    };
  }

  try {
    const result = await sendMailWithFallback({
      from: `"${FROM_NAME}" <${user}>`,
      to: recipient,
      subject: `🧪 Test Email from Astro Raj Email Service`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155; max-width: 500px;">
          <h2 style="margin-top: 0; color: #fbbf24; font-size: 20px;">Astro Raj Email Service Test</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
            Hari Om! Aapka email service successfully connect ho gaya hai aur customer & admin confirmation emails dispatch hone ke liye bilkul taiyar hain.
          </p>
          <div style="background: #1e293b; padding: 12px 16px; border-radius: 8px; margin: 16px 0; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Active Provider:</strong> Auto Fallback</p>
            <p style="margin: 4px 0;"><strong>Receiver:</strong> ${escapeHtml(recipient)}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> Connected & Verified</p>
          </div>
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            Jab bhi koi booking ya order paid hoga, automatic customer aur admin confirmation emails trigger ho jayenge (Strict single-dispatch guarantee).
          </p>
        </div>
      `,
    });
    const providerUsed = result?.provider || "Configured Email Provider";
    return {
      success: true,
      message: `Test email successfully sent to ${recipient} via ${providerUsed}!`,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const isTimeout = errorMsg.toLowerCase().includes("timeout");
    const hint = isTimeout && !resendApiKey && !brevoApiKey
      ? " DigitalOcean blocks outbound SMTP ports 25, 465, and 587 by default. To bypass this, add RESEND_API_KEY to your VPS environment variables for instant HTTPS (Port 443) delivery."
      : "";
    return {
      success: false,
      message: `Failed to send email: ${errorMsg}.${hint}`,
    };
  }
}

