import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase, getTestPrisma } from "./utils/db";
import { writeAuditEvent } from "@/lib/audit";

describe("audit logger", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("writes an audit entry with metadata", async () => {
    await writeAuditEvent({
      action: "task.create",
      entityType: "Task",
      entityId: "task-1",
      metadata: { title: "Test" },
      actor: "tester@able",
    });

    const prisma = await getTestPrisma();
    const events = await prisma.auditEvent.findMany();
    expect(events).toHaveLength(1);
    expect(events[0].actor).toBe("tester@able");
  });
});
