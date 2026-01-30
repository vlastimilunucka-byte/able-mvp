"use client";

import { LogEntry } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  logs: LogEntry[];
};

export default function LogPanel({ logs }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("INFO");

  const handleCreate = async () => {
    if (!message.trim()) return;
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim(), level, source: "manual-entry" }),
    });
    setMessage("");
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-white">Add log entry</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder="Log message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <select
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="INFO">Info</option>
            <option value="WARN">Warn</option>
            <option value="ERROR">Error</option>
          </select>
          <button
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50"
            onClick={handleCreate}
            disabled={isPending}
          >
            Add log
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{log.level}</span>
              <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="mt-2 text-sm text-slate-100">{log.message}</div>
          </div>
        ))}
        {logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-sm text-slate-500">
            No log entries yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
