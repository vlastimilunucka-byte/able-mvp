import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase } from "../utils/db";
import { GET, POST } from "@/app/api/incidents/route";
import { PATCH, DELETE } from "@/app/api/incidents/[id]/route";

describe("incidents API", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("creates and lists incidents", async () => {
    const request = new Request("http://localhost/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Latency spike", severity: "HIGH" }),
    });
    const createResponse = await POST(request);
    expect(createResponse.status).toBe(201);

    const listResponse = await GET();
    const listJson = await listResponse.json();
    expect(listJson.data).toHaveLength(1);
  });

  it("updates and deletes incidents", async () => {
    const createResponse = await POST(
      new Request("http://localhost/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Memory leak", status: "OPEN" }),
      })
    );
    const created = await createResponse.json();
    const incidentId = created.data.id;

    const patchResponse = await PATCH(
      new Request(`http://localhost/api/incidents/${incidentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVED" }),
      }),
      { params: Promise.resolve({ id: incidentId }) }
    );
    const patchJson = await patchResponse.json();
    expect(patchJson.data.status).toBe("RESOLVED");

    const deleteResponse = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: incidentId }),
    });
    expect(deleteResponse.status).toBe(200);
  });
});
