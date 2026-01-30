import assert from "node:assert/strict";
import { simulateAlert } from "../src/lib/alerts";
import { getPrisma } from "../src/lib/db";

async function run() {
  const prisma = getPrisma();
  const beforeAlerts = await prisma.alert.count();

  await simulateAlert({ title: "Smoke test alert", severity: "LOW", actor: "test@able" });

  const afterAlerts = await prisma.alert.count();
  assert.equal(afterAlerts, beforeAlerts + 1);

  const auditEvent = await prisma.auditEvent.findFirst({
    where: { action: "alert.simulate", actor: "test@able" },
    orderBy: { createdAt: "desc" },
  });

  assert.ok(auditEvent, "audit event should be recorded");
  await prisma.$disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
