import { getAnalyticsSnapshot } from "@/lib/analytics";

export default async function AnalyticsPage() {
  const snapshot = await getAnalyticsSnapshot();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="text-sm text-slate-400">Snapshot of workload and reliability signals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold text-white">Tasks by status</h2>
          <div className="mt-4 space-y-2 text-xs text-slate-300">
            {snapshot.tasks.map((entry) => (
              <div key={entry.status} className="flex items-center justify-between">
                <span>{entry.status}</span>
                <span>{entry._count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold text-white">Incidents by status</h2>
          <div className="mt-4 space-y-2 text-xs text-slate-300">
            {snapshot.incidents.map((entry) => (
              <div key={entry.status} className="flex items-center justify-between">
                <span>{entry.status}</span>
                <span>{entry._count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold text-white">Active alerts</h2>
          <p className="mt-4 text-2xl font-semibold text-white">{snapshot.activeAlerts}</p>
          <p className="text-xs text-slate-400">Open alerts needing attention.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold text-white">Logs last 24 hours</h2>
          <p className="mt-4 text-2xl font-semibold text-white">{snapshot.logsLast24h}</p>
          <p className="text-xs text-slate-400">Signals captured from the stack.</p>
        </div>
      </div>
    </div>
  );
}
