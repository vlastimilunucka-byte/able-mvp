import { NextResponse } from "next/server";
import { getMetricsSnapshot } from "@/lib/monitoring";

export const runtime = "nodejs";

export async function GET() {
  const snapshot = await getMetricsSnapshot();
  return NextResponse.json(snapshot);
}
