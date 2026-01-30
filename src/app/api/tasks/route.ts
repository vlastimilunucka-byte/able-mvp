import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { taskCreateSchema } from "@/lib/validation";
import { writeAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  const prisma = await getPrisma();
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: tasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = taskCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const prisma = await getPrisma();
  const task = await prisma.task.create({ data: parsed.data });

  await writeAuditEvent({
    action: "task.create",
    entityType: "Task",
    entityId: task.id,
    metadata: { title: task.title, status: task.status },
  });

  return NextResponse.json({ data: task }, { status: 201 });
}
