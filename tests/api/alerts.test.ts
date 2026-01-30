import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase } from "../utils/db";
import { GET, POST } from "@/app/api/alerts/route";
import { POST as Simulate } from "@/app/api/alerts/simulate/route";

describe("alerts API", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("creates and lists alerts", async () => {
    const request = new Request("http://localhost/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Disk pressure", severity: "MEDIUM" }),
    });
    const createResponse = await POST(request);
    expect(createResponse.status).toBe(201);

    const listResponse = await GET();
    const listJson = await listResponse.json();
    expect(listJson.data).toHaveLength(1);
  });

  it("simulates an alert", async () => {
    const response = await Simulate();
    expect(response.status).toBe(201);
    const listResponse = await GET();
    const listJson = await listResponse.json();
    expect(listJson.data.length).toBeGreaterThan(0);
  });
});
