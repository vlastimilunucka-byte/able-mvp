import { getAnalyticsSnapshot } from "@/lib/analytics";
import { getPrisma } from "@/lib/db";

export default async function Home() {
  const prisma = getPrisma();
  const [snapshot, latestAlerts, latestRelease] = await Promise.all([
    getAnalyticsSnapshot(),
    prisma.alert.findMany({ orderBy: { triggeredAt: "desc" }, take: 3 }),
    prisma.releaseNote.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Operations overview</h1>
        <p className="mt-2 text-sm text-slate-400">
          MVP combining task tracking and reliability operations. Use the navigation to explore
          boards, incidents, alerts, logs, analytics, and releases.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs text-slate-400">Active alerts</p>
          <p className="mt-2 text-2xl font-semibold text-white">{snapshot.activeAlerts}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs text-slate-400">Logs last 24h</p>
          <p className="mt-2 text-2xl font-semibold text-white">{snapshot.logsLast24h}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs text-slate-400">Task columns</p>
          <p className="mt-2 text-2xl font-semibold text-white">{snapshot.tasks.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs text-slate-400">Incident states</p>
          <p className="mt-2 text-2xl font-semibold text-white">{snapshot.incidents.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Latest alerts</h2>
          <div className="mt-4 space-y-3">
            {latestAlerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="text-sm text-white">{alert.title}</div>
                <div className="text-xs text-slate-400">
                  {alert.status} · {alert.severity}
                </div>
              </div>
            ))}
            {latestAlerts.length === 0 ? (
              <p className="text-sm text-slate-500">No alerts yet.</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h2 className="text-lg font-semibold text-white">Release notes</h2>
          {latestRelease ? (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-slate-400">{latestRelease.version}</p>
              <p className="text-sm font-semibold text-white">{latestRelease.title}</p>
              <p className="text-xs text-slate-400">{latestRelease.body}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No releases published yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
