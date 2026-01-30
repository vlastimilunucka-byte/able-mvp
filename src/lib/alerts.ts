import { AlertStatus, Severity } from "@prisma/client";
import { getPrisma } from "@/lib/db";
import { writeAuditEvent } from "@/lib/audit";

type SimulateAlertInput = {
  title: string;
  severity?: Severity;
  incidentId?: string | null;
  actor?: string;
};

export async function simulateAlert(input: SimulateAlertInput) {
  const prisma = await getPrisma();
  const alert = await prisma.alert.create({
    data: {
      title: input.title,
      severity: input.severity ?? Severity.MEDIUM,
      status: AlertStatus.ACTIVE,
      incidentId: input.incidentId ?? null,
    },
  });

  await prisma.logEntry.create({
    data: {
      message: `Alert triggered: ${alert.title}`,
      level: "WARN",
      source: "alert-simulator",
      incidentId: alert.incidentId,
    },
  });

  await writeAuditEvent({
    action: "alert.simulate",
    entityType: "Alert",
    entityId: alert.id,
    metadata: { severity: alert.severity },
    actor: input.actor,
  });

  return alert;
}
