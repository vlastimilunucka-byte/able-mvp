import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

type GlobalPrisma = {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalPrisma;

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["warn", "error"],
    });
  }

  return globalForPrisma.prisma;
}
