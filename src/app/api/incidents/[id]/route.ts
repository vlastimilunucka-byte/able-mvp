import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { incidentUpdateSchema } from "@/lib/validation";
import { writeAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";

type Params = {
  params: { id: string };
};

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const parsed = incidentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const prisma = getPrisma();
  const existing = await prisma.incident.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  const incident = await prisma.incident.update({
    where: { id: params.id },
    data: parsed.data,
  });

  await writeAuditEvent({
    action: "incident.update",
    entityType: "Incident",
    entityId: incident.id,
    metadata: { status: incident.status, severity: incident.severity },
  });

  return NextResponse.json({ data: incident });
}

export async function DELETE(_: Request, { params }: Params) {
  const prisma = getPrisma();
  const existing = await prisma.incident.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  await prisma.incident.delete({ where: { id: params.id } });

  await writeAuditEvent({
    action: "incident.delete",
    entityType: "Incident",
    entityId: params.id,
    metadata: { title: existing.title },
  });

  return NextResponse.json({ ok: true });
}
