import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "admin_session";

const EXPECTED_EMAIL = (process.env.ADMIN_EMAIL || "thakur.thakur1995@gmail.com").trim().toLowerCase();
const EXPECTED_PASSWORD = (process.env.ADMIN_PASSWORD || "Rajat@1995").trim();
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "astroraj_sacred_admin_secret_key_2026";

export function validateAdminCredentials(email?: string, password?: string): boolean {
  if (!email || !password) return false;
  return (
    email.trim().toLowerCase() === EXPECTED_EMAIL &&
    password.trim() === EXPECTED_PASSWORD
  );
}

export function createAdminSessionToken(email: string): string {
  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    role: "admin",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // Valid for 7 days
    iat: Date.now(),
  });

  const b64Payload = Buffer.from(payload, "utf8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(b64Payload)
    .digest("base64url");

  return `${b64Payload}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return false;
  }

  const [b64Payload, signature] = token.split(".");
  if (!b64Payload || !signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(b64Payload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return false;
  }

  try {
    const jsonStr = Buffer.from(b64Payload, "base64url").toString("utf8");
    const payload = JSON.parse(jsonStr);

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    if (payload.role !== "admin") {
      return false;
    }

    if (payload.email !== EXPECTED_EMAIL) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
