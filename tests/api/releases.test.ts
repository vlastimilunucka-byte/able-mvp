import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase } from "../utils/db";
import { GET, POST } from "@/app/api/release-notes/route";

describe("release notes API", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("creates and lists release notes", async () => {
    const request = new Request("http://localhost/api/release-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        version: "0.2.0",
        title: "Test release",
        body: "Covered by tests.",
      }),
    });
    const createResponse = await POST(request);
    expect(createResponse.status).toBe(201);

    const listResponse = await GET();
    const listJson = await listResponse.json();
    expect(listJson.data).toHaveLength(1);
  });
});
