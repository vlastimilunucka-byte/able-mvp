import { beforeEach, describe, expect, it } from "vitest";
import { clearDatabase, getTestPrisma } from "../utils/db";
import { GET, POST } from "@/app/api/tasks/route";
import { PATCH, DELETE } from "@/app/api/tasks/[id]/route";

describe("tasks API", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("creates and lists tasks", async () => {
    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Write tests", priority: 2 }),
    });
    const createResponse = await POST(request);
    expect(createResponse.status).toBe(201);

    const listResponse = await GET();
    const listJson = await listResponse.json();
    expect(listJson.data).toHaveLength(1);
  });

  it("updates and deletes task", async () => {
    const prisma = await getTestPrisma();
    const task = await prisma.task.create({ data: { title: "Delete me", status: "TODO" } });

    const patchRequest = new Request(`http://localhost/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DONE" }),
    });
    const patchResponse = await PATCH(patchRequest, { params: Promise.resolve({ id: task.id }) });
    const patchJson = await patchResponse.json();
    expect(patchJson.data.status).toBe("DONE");

    const deleteResponse = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: task.id }),
    });
    expect(deleteResponse.status).toBe(200);
  });
});
