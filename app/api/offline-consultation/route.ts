import { NextRequest, NextResponse } from "next/server";
import { createOfflineBookingInquiry } from "@/lib/supabase/repository";
import { SITE_SETTINGS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      serviceId,
      serviceCategory,
      serviceTitle,
      fullName,
      phone,
      whatsappNumber,
      email,
      city,
      address,
      consultationPreference,
      preferredDate,
      preferredSlot,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      notes,
    } = body;

    // Basic Validation
    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and Mobile number are required." },
        { status: 400 }
      );
    }

    const waNum = whatsappNumber || phone;

    const record = await createOfflineBookingInquiry({
      serviceId: serviceId || "offline-consultation",
      serviceCategory: serviceCategory || "Astrology",
      serviceTitle: serviceTitle || "Offline Consultation",
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsappNumber: waNum.trim(),
      email: email?.trim(),
      city: city?.trim() || "Not specified",
      address: address?.trim(),
      consultationPreference: consultationPreference || "Rishikesh Ashram (In-Person)",
      preferredDate: preferredDate || new Date().toISOString().split("T")[0],
      preferredSlot: preferredSlot || "Morning (10:00 AM - 01:00 PM)",
      dateOfBirth: dateOfBirth?.trim(),
      timeOfBirth: timeOfBirth?.trim(),
      placeOfBirth: placeOfBirth?.trim(),
      notes: notes?.trim(),
    });

    // Construct formatted WhatsApp message for Admin
    const waLines = [
      `*Hari Om Guruji! New Offline Consultation Booking*`,
      `----------------------------------------`,
      `*Inquiry Code:* ${record.bookingCode}`,
      `*Category:* ${serviceCategory || "Vedic Consultation"}`,
      `*Service:* ${serviceTitle || "Personal Consultation"}`,
      `*Client Name:* ${fullName}`,
      `*Phone Number:* ${phone}`,
      `*WhatsApp:* ${waNum}`,
      email ? `*Email:* ${email}` : null,
      `*City / Location:* ${city || "Not specified"}`,
      address ? `*Address / Property:* ${address}` : null,
      `*Visit Preference:* ${consultationPreference || "In-Person at Rishikesh Ashram"}`,
      `*Preferred Date:* ${preferredDate}`,
      `*Preferred Time Slot:* ${preferredSlot}`,
      dateOfBirth ? `*Birth Details:* DOB: ${dateOfBirth} | TOB: ${timeOfBirth || "N/A"} | POB: ${placeOfBirth || "N/A"}` : null,
      notes ? `*Notes / Requirements:* ${notes}` : null,
      `----------------------------------------`,
      `_Please confirm my offline appointment slot and share manual payment details (UPI/Bank Transfer)._`,
    ].filter(Boolean);

    const whatsappText = waLines.join("\n");
    const whatsappUrl = `https://wa.me/${SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
      whatsappText
    )}`;

    return NextResponse.json({
      success: true,
      bookingCode: record.bookingCode,
      whatsappUrl,
      message: "Offline consultation request generated successfully.",
    });
  } catch (error: any) {
    console.error("[offline-consultation API error]:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to process offline consultation." },
      { status: 500 }
    );
  }
}
