import { getPrisma } from "@/lib/db";

export async function getTestPrisma() {
  return await getPrisma();
}

export async function clearDatabase() {
  const prisma = await getTestPrisma();
  await prisma.alert.deleteMany();
  await prisma.logEntry.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.task.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.releaseNote.deleteMany();
}
