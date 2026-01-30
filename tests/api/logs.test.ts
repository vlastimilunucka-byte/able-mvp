import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase } from "../utils/db";
import { GET, POST } from "@/app/api/logs/route";

describe("logs API", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("creates and lists logs", async () => {
    const request = new Request("http://localhost/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Something happened", level: "INFO" }),
    });
    const createResponse = await POST(request);
    expect(createResponse.status).toBe(201);

    const listResponse = await GET();
    const listJson = await listResponse.json();
    expect(listJson.data).toHaveLength(1);
  });
});
