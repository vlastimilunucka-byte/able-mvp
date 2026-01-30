import { NextResponse } from "next/server";
import { simulateAlert } from "@/lib/alerts";

export const runtime = "nodejs";

export async function POST() {
  const alert = await simulateAlert({
    title: "Synthetic latency alert",
    severity: "HIGH",
  });

  return NextResponse.json({ data: alert }, { status: 201 });
}
