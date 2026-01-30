import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { promises as fs } from "node:fs";
import path from "node:path";

type GlobalPrisma = {
  prisma?: PrismaClient;
  initPromise?: Promise<void>;
};

const globalForPrisma = globalThis as GlobalPrisma;

async function ensureSchema(prisma: PrismaClient) {
  const existing = await prisma.$queryRawUnsafe<unknown[]>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='Task'"
  );
  if (existing.length > 0) return;

  const migrationPath = path.join(
    process.cwd(),
    "prisma",
    "migrations",
    "20260130095426_init",
    "migration.sql"
  );
  const sql = await fs.readFile(migrationPath, "utf8");
  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }
}

export async function getPrisma() {
  if (!globalForPrisma.prisma) {
    const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
    const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["warn", "error"],
    });
  }

  if (!globalForPrisma.initPromise) {
    globalForPrisma.initPromise = ensureSchema(globalForPrisma.prisma);
  }

  await globalForPrisma.initPromise;
  return globalForPrisma.prisma;
}
