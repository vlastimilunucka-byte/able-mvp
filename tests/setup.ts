import { afterAll, beforeAll } from "vitest";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { resetPrismaForTests } from "@/lib/db";

const dbPath = path.join(os.tmpdir(), `able-mvp-test-${process.pid}.db`);
const databaseUrl = `file:${dbPath.replace(/\\/g, "/")}`;

beforeAll(async () => {
  process.env.DATABASE_URL = databaseUrl;
  await resetPrismaForTests();
});

afterAll(async () => {
  await resetPrismaForTests();
  await fs.rm(dbPath, { force: true });
});
