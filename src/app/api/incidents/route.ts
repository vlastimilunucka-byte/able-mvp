import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { incidentCreateSchema } from "@/lib/validation";
import { writeAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  const prisma = getPrisma();
  const incidents = await prisma.incident.findMany({
    orderBy: { createdAt: "desc" },
    include: { alerts: true, logs: true },
  });
  return NextResponse.json({ data: incidents });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = incidentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const prisma = getPrisma();
  const incident = await prisma.incident.create({ data: parsed.data });

  await writeAuditEvent({
    action: "incident.create",
    entityType: "Incident",
    entityId: incident.id,
    metadata: { severity: incident.severity, status: incident.status },
  });

  return NextResponse.json({ data: incident }, { status: 201 });
}
