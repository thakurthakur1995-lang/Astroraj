import { NextRequest, NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to") || undefined;

  const result = await sendTestEmail(to);

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const to = body.to || undefined;
    const result = await sendTestEmail(to);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
