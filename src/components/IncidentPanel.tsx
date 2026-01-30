"use client";

import { Alert, Incident, LogEntry } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type IncidentWithRelations = Incident & { alerts: Alert[]; logs: LogEntry[] };

const statusFlow = ["OPEN", "INVESTIGATING", "MITIGATED", "RESOLVED"] as const;

function nextStatus(status: Incident["status"]) {
  const idx = statusFlow.indexOf(status);
  return statusFlow[Math.min(idx + 1, statusFlow.length - 1)];
}

type Props = {
  incidents: IncidentWithRelations[];
};

export default function IncidentPanel({ incidents }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");

  const handleCreate = async () => {
    if (!title.trim()) return;
    await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), severity }),
    });
    setTitle("");
    startTransition(() => router.refresh());
  };

  const advanceIncident = async (incident: Incident) => {
    if (incident.status === "RESOLVED") return;
    await fetch(`/api/incidents/${incident.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus(incident.status) }),
    });
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-white">Open new incident</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder="Incident title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <select
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <button
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400 disabled:opacity-50"
            onClick={handleCreate}
            disabled={isPending}
          >
            Create incident
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">{incident.title}</h3>
                <p className="text-xs text-slate-400">
                  {incident.status} · Severity {incident.severity}
                </p>
              </div>
              <button
                className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:bg-slate-700 disabled:opacity-50"
                onClick={() => advanceIncident(incident)}
                disabled={incident.status === "RESOLVED"}
              >
                Advance status
              </button>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Logs: {incident.logs.length} · Alerts: {incident.alerts.length}
            </div>
          </div>
        ))}
        {incidents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-sm text-slate-500">
            No incidents yet. Create one to simulate response flow.
          </div>
        ) : null}
      </div>
    </div>
  );
}
