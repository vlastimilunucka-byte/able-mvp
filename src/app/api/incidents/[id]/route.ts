import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { incidentUpdateSchema } from "@/lib/validation";
import { writeAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = incidentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const prisma = await getPrisma();
  const existing = await prisma.incident.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  const incident = await prisma.incident.update({
    where: { id },
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
  const { id } = await params;
  const prisma = await getPrisma();
  const existing = await prisma.incident.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  await prisma.incident.delete({ where: { id } });

  await writeAuditEvent({
    action: "incident.delete",
    entityType: "Incident",
    entityId: id,
    metadata: { title: existing.title },
  });

  return NextResponse.json({ ok: true });
}
