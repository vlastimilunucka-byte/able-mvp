import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, TaskStatus, IncidentStatus, Severity, AlertStatus, LogLevel } from "@prisma/client";

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  const prisma = new PrismaClient({
    log: ["warn", "error"],
    adapter,
  });
  await prisma.alert.deleteMany();
  await prisma.logEntry.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.task.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.releaseNote.deleteMany();

  await prisma.task.createMany({
    data: [
      { title: "Set up landing page", status: TaskStatus.TODO, priority: 2 },
      { title: "Wire incident flow", status: TaskStatus.DOING, priority: 1 },
      { title: "Add audit log view", status: TaskStatus.BACKLOG, priority: 3 },
      { title: "Ship MVP demo", status: TaskStatus.DONE, priority: 1 },
    ],
  });

  const incident = await prisma.incident.create({
    data: {
      title: "API latency spike",
      description: "Elevated p95 latency detected on core API",
      severity: Severity.HIGH,
      status: IncidentStatus.INVESTIGATING,
      runbook: "Check DB load, scale API, inspect error logs.",
    },
  });

  await prisma.logEntry.createMany({
    data: [
      {
        message: "Latency alert triggered on /api/tasks",
        level: LogLevel.WARN,
        source: "api-gateway",
        incidentId: incident.id,
      },
      {
        message: "DB CPU at 95%, scaling replicas",
        level: LogLevel.INFO,
        source: "db-monitor",
        incidentId: incident.id,
      },
    ],
  });

  await prisma.alert.create({
    data: {
      title: "Latency threshold breached",
      status: AlertStatus.ACTIVE,
      severity: Severity.HIGH,
      incidentId: incident.id,
    },
  });

  await prisma.auditEvent.createMany({
    data: [
      {
        actor: "demo@able",
        action: "task.create",
        entityType: "Task",
        metadata: { title: "Set up landing page" },
      },
      {
        actor: "demo@able",
        action: "incident.create",
        entityType: "Incident",
        entityId: incident.id,
        metadata: { severity: "HIGH" },
      },
    ],
  });

  await prisma.releaseNote.createMany({
    data: [
      {
        version: "0.1.0",
        title: "MVP baseline",
        body: "Initial tasks board, incidents, alerts, audit log, and analytics.",
      },
    ],
  });

  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
