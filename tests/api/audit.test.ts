import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase } from "../utils/db";
import { GET as AuditGET } from "@/app/api/audit/route";
import { POST as TaskPOST } from "@/app/api/tasks/route";

describe("audit API", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("lists audit events after actions", async () => {
    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Audit me", priority: 3 }),
    });
    await TaskPOST(request);

    const response = await AuditGET();
    const json = await response.json();
    expect(json.data.length).toBeGreaterThan(0);
  });
});
