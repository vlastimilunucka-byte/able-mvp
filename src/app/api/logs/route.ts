import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { logCreateSchema } from "@/lib/validation";
import { writeAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  const prisma = getPrisma();
  const logs = await prisma.logEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ data: logs });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = logCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const prisma = getPrisma();
  const log = await prisma.logEntry.create({ data: parsed.data });

  await writeAuditEvent({
    action: "log.create",
    entityType: "LogEntry",
    entityId: log.id,
    metadata: { level: log.level, source: log.source },
  });

  return NextResponse.json({ data: log }, { status: 201 });
}
