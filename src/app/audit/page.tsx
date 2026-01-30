import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const prisma = await getPrisma();
  const events = await prisma.auditEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Audit log</h1>
        <p className="text-sm text-slate-400">Immutable trail of actions and changes.</p>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{event.actor}</span>
              <span>{new Date(event.createdAt).toLocaleString()}</span>
            </div>
            <div className="mt-2 text-sm text-white">
              {event.action} · {event.entityType}
            </div>
            {event.metadata ? (
              <pre className="mt-2 rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-slate-300">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            ) : null}
          </div>
        ))}
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-sm text-slate-500">
            Audit log is empty.
          </div>
        ) : null}
      </div>
    </div>
  );
}
