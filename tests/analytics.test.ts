import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase, getTestPrisma } from "./utils/db";
import { getAnalyticsSnapshot } from "@/lib/analytics";

describe("analytics snapshot", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("aggregates counts by status", async () => {
    const prisma = await getTestPrisma();
    await prisma.task.createMany({
      data: [
        { title: "A", status: "BACKLOG" },
        { title: "B", status: "DONE" },
        { title: "C", status: "DONE" },
      ],
    });
    await prisma.incident.createMany({
      data: [
        { title: "I1", status: "OPEN", severity: "LOW" },
        { title: "I2", status: "RESOLVED", severity: "MEDIUM" },
      ],
    });

    const snapshot = await getAnalyticsSnapshot();
    const doneCount = snapshot.tasks.find((entry) => entry.status === "DONE")?._count ?? 0;
    expect(doneCount).toBe(2);
    expect(snapshot.incidents.length).toBeGreaterThan(0);
  });
});
