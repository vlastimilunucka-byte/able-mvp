import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { taskUpdateSchema } from "@/lib/validation";
import { writeAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = taskUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const prisma = getPrisma();
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const task = await prisma.task.update({
    where: { id },
    data: parsed.data,
  });

  await writeAuditEvent({
    action: "task.update",
    entityType: "Task",
    entityId: task.id,
    metadata: { status: task.status },
  });

  return NextResponse.json({ data: task });
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const prisma = getPrisma();
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  await prisma.task.delete({ where: { id } });

  await writeAuditEvent({
    action: "task.delete",
    entityType: "Task",
    entityId: id,
    metadata: { title: existing.title },
  });

  return NextResponse.json({ ok: true });
}
