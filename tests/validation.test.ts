import { describe, expect, it } from "vitest";
import {
  incidentCreateSchema,
  incidentUpdateSchema,
  taskCreateSchema,
  taskUpdateSchema,
} from "@/lib/validation";

describe("validation schemas", () => {
  it("validates task create", () => {
    const parsed = taskCreateSchema.safeParse({ title: "Ship MVP", priority: 2 });
    expect(parsed.success).toBe(true);
  });

  it("rejects empty task title", () => {
    const parsed = taskCreateSchema.safeParse({ title: "" });
    expect(parsed.success).toBe(false);
  });

  it("validates incident create", () => {
    const parsed = incidentCreateSchema.safeParse({ title: "Latency spike", severity: "HIGH" });
    expect(parsed.success).toBe(true);
  });

  it("validates update partials", () => {
    const parsed = taskUpdateSchema.safeParse({ status: "DONE" });
    expect(parsed.success).toBe(true);
    const incidentParsed = incidentUpdateSchema.safeParse({ status: "RESOLVED" });
    expect(incidentParsed.success).toBe(true);
  });
});
