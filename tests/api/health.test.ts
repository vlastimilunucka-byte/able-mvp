import { describe, expect, it } from "vitest";
import { GET as HealthGET } from "@/app/api/health/route";
import { GET as MetricsGET } from "@/app/api/metrics/route";

describe("health and metrics API", () => {
  it("returns health snapshot", async () => {
    const response = await HealthGET();
    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.checks?.database?.ok).toBe(true);
  });

  it("returns metrics snapshot", async () => {
    const response = await MetricsGET();
    const json = await response.json();
    expect(json.environment).toBeDefined();
    expect(json.node?.version).toBeDefined();
  });
});
