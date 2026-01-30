import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { promises as fs } from "node:fs";
import path from "node:path";

type GlobalPrisma = {
  prisma?: PrismaClient;
  initPromise?: Promise<void>;
};

const globalForPrisma = globalThis as GlobalPrisma;

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const isVercel = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
  if (isVercel) {
    return "file:/tmp/able.db";
  }

  return "file:./dev.db";
}

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
    const databaseUrl = resolveDatabaseUrl();
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

export async function resetPrismaForTests() {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
  }
  delete globalForPrisma.prisma;
  delete globalForPrisma.initPromise;
}
