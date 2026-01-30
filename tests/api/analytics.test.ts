import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase, getTestPrisma } from "../utils/db";
import { GET } from "@/app/api/analytics/route";

describe("analytics API", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("returns aggregated metrics", async () => {
    const prisma = await getTestPrisma();
    await prisma.task.createMany({
      data: [
        { title: "Task A", status: "DONE" },
        { title: "Task B", status: "DONE" },
      ],
    });

    const response = await GET();
    const json = await response.json();
    expect(json.data.activeAlerts).toBeDefined();
    const doneCount = json.data.tasks.find((entry: { status: string }) => entry.status === "DONE")?._count ?? 0;
    expect(doneCount).toBe(2);
  });
});
