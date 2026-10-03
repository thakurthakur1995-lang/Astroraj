import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = process.env.RAZORPAY_KEY_ID?.trim();
const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

export function getRazorpayClient(): Razorpay {
  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local."
    );
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!key_secret || !signature || !orderId || !paymentId) {
    console.error("RAZORPAY_KEY_SECRET or signature parameter is missing for verification.");
    return false;
  }

  try {
    const payload = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(payload)
      .digest("hex");

    const genBuf = Buffer.from(generatedSignature, "utf8");
    const sigBuf = Buffer.from(signature.trim(), "utf8");

    if (genBuf.length !== sigBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(genBuf, sigBuf);
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  if (!webhookSecret || !signature || !rawBody) return false;

  try {
    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret.trim())
      .update(rawBody, "utf8")
      .digest("hex");

    const genBuf = Buffer.from(generatedSignature, "utf8");
    const sigBuf = Buffer.from(signature.trim(), "utf8");

    if (genBuf.length !== sigBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(genBuf, sigBuf);
  } catch (err) {
    console.error("Webhook signature verification error:", err);
    return false;
  }
}

