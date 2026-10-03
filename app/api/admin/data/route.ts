import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllBookings, getAllOrders } from "@/lib/supabase/repository";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value || req.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const [bookings, orders] = await Promise.all([
      getAllBookings(),
      getAllOrders(),
    ]);

    return NextResponse.json({
      success: true,
      bookings,
      orders,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Admin Data Fetch Error]:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch admin data." },
      { status: 500 }
    );
  }
}
