import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/db";
import { getActor } from "@/lib/auth";

type AuditInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  actor?: string;
};

export async function writeAuditEvent(input: AuditInput) {
  const prisma = getPrisma();
  const actor = input.actor ?? (await getActor());

  await prisma.auditEvent.create({
    data: {
      actor,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      metadata: input.metadata ? (input.metadata as Prisma.InputJsonValue) : undefined,
    },
  });
}
