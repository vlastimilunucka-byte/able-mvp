import { NextResponse } from "next/server";
import { getAnalyticsSnapshot } from "@/lib/analytics";

export const runtime = "nodejs";

export async function GET() {
  const snapshot = await getAnalyticsSnapshot();
  return NextResponse.json({ data: snapshot });
}
