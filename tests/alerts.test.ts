import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase, getTestPrisma } from "./utils/db";
import { simulateAlert } from "@/lib/alerts";

describe("alert simulator", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("creates alert, log, and audit entry", async () => {
    const alert = await simulateAlert({ title: "CPU spike", severity: "HIGH", actor: "tester@able" });
    expect(alert.title).toBe("CPU spike");

    const prisma = await getTestPrisma();
    const logs = await prisma.logEntry.findMany();
    const audits = await prisma.auditEvent.findMany();

    expect(logs).toHaveLength(1);
    expect(audits).toHaveLength(1);
    expect(audits[0].action).toBe("alert.simulate");
  });
});
