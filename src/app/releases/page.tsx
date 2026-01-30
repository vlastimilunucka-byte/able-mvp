import ReleasePanel from "@/components/ReleasePanel";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  const prisma = await getPrisma();
  const releases = await prisma.releaseNote.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Release center</h1>
        <p className="text-sm text-slate-400">Track changes and communicate updates.</p>
      </div>
      <ReleasePanel releases={releases} />
    </div>
  );
}
