import { getPrisma } from "@/lib/db";

export async function getAnalyticsSnapshot() {
  const prisma = await getPrisma();
  const [taskCounts, incidentCounts, activeAlerts, recentLogs] = await Promise.all([
    prisma.task.groupBy({ by: ["status"], _count: true }),
    prisma.incident.groupBy({ by: ["status"], _count: true }),
    prisma.alert.count({ where: { status: "ACTIVE" } }),
    prisma.logEntry.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return {
    tasks: taskCounts,
    incidents: incidentCounts,
    activeAlerts,
    logsLast24h: recentLogs,
  };
}
