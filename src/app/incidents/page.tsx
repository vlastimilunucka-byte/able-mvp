import IncidentPanel from "@/components/IncidentPanel";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const prisma = await getPrisma();
  const incidents = await prisma.incident.findMany({
    orderBy: { createdAt: "desc" },
    include: { alerts: true, logs: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Incident response</h1>
        <p className="text-sm text-slate-400">
          Track incidents, severity, and progress through resolution.
        </p>
      </div>
      <IncidentPanel incidents={incidents} />
    </div>
  );
}
