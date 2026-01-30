import { getPrisma } from "@/lib/db";
import { getAnalyticsSnapshot } from "@/lib/analytics";

type HealthCheck = {
  ok: boolean;
  latencyMs?: number;
  error?: string;
};

type HealthSnapshot = {
  ok: boolean;
  ts: string;
  version: string;
  environment: string;
  uptimeSec: number;
  checks: {
    database: HealthCheck;
  };
};

type MetricsSnapshot = {
  ts: string;
  version: string;
  environment: string;
  uptimeSec: number;
  node: {
    version: string;
    platform: string;
  };
  memoryMB: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
  };
  checks: {
    database: HealthCheck;
  };
  analytics: Awaited<ReturnType<typeof getAnalyticsSnapshot>> | null;
  analyticsError?: string;
};

function getAppVersion() {
  return (
    process.env.APP_VERSION ??
    process.env.NEXT_PUBLIC_APP_VERSION ??
    process.env.npm_package_version ??
    "dev"
  );
}

async function checkDatabase(): Promise<HealthCheck> {
  const prisma = await getPrisma();
  const startedAt = Date.now();

  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    return { ok: true, latencyMs: Date.now() - startedAt };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return { ok: false, latencyMs: Date.now() - startedAt, error: message };
  }
}

export async function getHealthSnapshot(): Promise<HealthSnapshot> {
  const database = await checkDatabase();

  return {
    ok: database.ok,
    ts: new Date().toISOString(),
    version: getAppVersion(),
    environment: process.env.NODE_ENV ?? "development",
    uptimeSec: Math.floor(process.uptime()),
    checks: { database },
  };
}

export async function getMetricsSnapshot(): Promise<MetricsSnapshot> {
  const [database, analyticsResult] = await Promise.allSettled([
    checkDatabase(),
    getAnalyticsSnapshot(),
  ]);

  let analytics: MetricsSnapshot["analytics"] = null;
  let analyticsError: MetricsSnapshot["analyticsError"];
  if (analyticsResult.status === "fulfilled") {
    analytics = analyticsResult.value;
  } else {
    analyticsError =
      analyticsResult.reason instanceof Error
        ? analyticsResult.reason.message
        : "unknown error";
  }

  const databaseCheck =
    database.status === "fulfilled"
      ? database.value
      : {
          ok: false,
          error:
            database.reason instanceof Error
              ? database.reason.message
              : "unknown error",
        };

  const memory = process.memoryUsage();

  const snapshot: MetricsSnapshot = {
    ts: new Date().toISOString(),
    version: getAppVersion(),
    environment: process.env.NODE_ENV ?? "development",
    uptimeSec: Math.floor(process.uptime()),
    node: {
      version: process.version,
      platform: process.platform,
    },
    memoryMB: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
    },
    checks: { database: databaseCheck },
    analytics,
  };

  if (analyticsError) {
    snapshot.analyticsError = analyticsError;
  }

  return snapshot;
}
