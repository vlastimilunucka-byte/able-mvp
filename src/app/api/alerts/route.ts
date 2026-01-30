import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { alertCreateSchema } from "@/lib/validation";
import { writeAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  const prisma = await getPrisma();
  const alerts = await prisma.alert.findMany({
    orderBy: { triggeredAt: "desc" },
    include: { incident: true },
  });
  return NextResponse.json({ data: alerts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = alertCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const prisma = await getPrisma();
  const alert = await prisma.alert.create({
    data: {
      title: parsed.data.title,
      severity: parsed.data.severity,
      incidentId: parsed.data.incidentId ?? null,
    },
  });

  await writeAuditEvent({
    action: "alert.create",
    entityType: "Alert",
    entityId: alert.id,
    metadata: { severity: alert.severity },
  });

  return NextResponse.json({ data: alert }, { status: 201 });
}
