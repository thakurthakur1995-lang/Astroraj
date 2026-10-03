import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateBookingStatus, updateOrderStatus } from "@/lib/supabase/repository";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value || req.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, id, status, meetingLink, adminNotes } = body;

    if (!type || !id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (type, id, status)." },
        { status: 400 }
      );
    }

    if (type === "booking") {
      const success = await updateBookingStatus(id, status, { meetingLink, adminNotes });
      if (!success) {
        return NextResponse.json(
          { success: false, message: "Failed to update booking status in database." },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, message: "Booking status updated successfully." });
    }

    if (type === "order") {
      const success = await updateOrderStatus(id, status);
      if (!success) {
        return NextResponse.json(
          { success: false, message: "Failed to update order status in database." },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, message: "Order status updated successfully." });
    }

    return NextResponse.json(
      { success: false, message: "Invalid type. Expected 'booking' or 'order'." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[Admin Update Status Error]:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
