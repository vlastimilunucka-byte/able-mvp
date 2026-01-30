"use client";

import { Alert } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  alerts: Alert[];
};

export default function AlertPanel({ alerts }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const simulate = async () => {
    await fetch("/api/alerts/simulate", { method: "POST" });
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Alerts</h2>
          <p className="text-xs text-slate-400">Simulate a new alert and track response.</p>
        </div>
        <button
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
          onClick={simulate}
          disabled={isPending}
        >
          Simulate alert
        </button>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">{alert.title}</div>
                <div className="text-xs text-slate-400">
                  {alert.status} · Severity {alert.severity}
                </div>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(alert.triggeredAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-sm text-slate-500">
            No alerts yet. Run a simulation to populate the stream.
          </div>
        ) : null}
      </div>
    </div>
  );
}
