import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { writeAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  const prisma = await getPrisma();
  const notes = await prisma.releaseNote.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: notes });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { version?: string; title?: string; body?: string };
  if (!body?.version || !body?.title || !body?.body) {
    return NextResponse.json({ error: "Missing version/title/body" }, { status: 400 });
  }

  const prisma = await getPrisma();
  const note = await prisma.releaseNote.create({
    data: {
      version: body.version,
      title: body.title,
      body: body.body,
    },
  });

  await writeAuditEvent({
    action: "release.create",
    entityType: "ReleaseNote",
    entityId: note.id,
    metadata: { version: note.version },
  });

  return NextResponse.json({ data: note }, { status: 201 });
}
