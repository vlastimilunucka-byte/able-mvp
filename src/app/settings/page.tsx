import { headers, cookies } from "next/headers";

export default async function SettingsPage() {
  const actorHeader = headers().get("x-actor");
  const actorCookie = cookies().get("actor")?.value;
  const actor = actorHeader ?? actorCookie ?? "demo@able";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-slate-400">Demo configuration and integration placeholders.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold text-white">Current actor</h2>
          <p className="mt-2 text-xs text-slate-400">Audit logs are tagged with this actor.</p>
          <p className="mt-4 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100">
            {actor}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold text-white">AI/MCP placeholder</h2>
          <p className="mt-2 text-sm text-slate-400">
            Reserved space for AI assistants, playbooks, and MCP integrations. Future versions can
            plug incident summaries, auto-remediation, or agent-driven triage here.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
        <h2 className="text-sm font-semibold text-white">API endpoints</h2>
        <ul className="mt-3 grid gap-2 text-xs text-slate-400 md:grid-cols-2">
          <li>/api/tasks</li>
          <li>/api/incidents</li>
          <li>/api/alerts</li>
          <li>/api/alerts/simulate</li>
          <li>/api/logs</li>
          <li>/api/audit</li>
          <li>/api/analytics</li>
          <li>/api/release-notes</li>
        </ul>
      </div>
    </div>
  );
}
