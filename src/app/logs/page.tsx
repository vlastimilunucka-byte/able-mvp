import LogPanel from "@/components/LogPanel";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const prisma = await getPrisma();
  const logs = await prisma.logEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Operational logs</h1>
        <p className="text-sm text-slate-400">Unified stream for events and status updates.</p>
      </div>
      <LogPanel logs={logs} />
    </div>
  );
}
