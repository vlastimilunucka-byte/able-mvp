import AlertPanel from "@/components/AlertPanel";
import { getPrisma } from "@/lib/db";

export default async function AlertsPage() {
  const prisma = getPrisma();
  const alerts = await prisma.alert.findMany({
    orderBy: { triggeredAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Alerting</h1>
        <p className="text-sm text-slate-400">
          Alerts help teams respond quickly to reliability issues.
        </p>
      </div>
      <AlertPanel alerts={alerts} />
    </div>
  );
}
