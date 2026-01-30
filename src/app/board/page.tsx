import TaskBoard from "@/components/TaskBoard";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const prisma = await getPrisma();
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Task board</h1>
        <p className="text-sm text-slate-400">Plan, execute, and review work in one place.</p>
      </div>
      <TaskBoard tasks={tasks} />
    </div>
  );
}
