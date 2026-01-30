"use client";

import { Task, TaskStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

const columns: TaskStatus[] = ["BACKLOG", "TODO", "DOING", "DONE"];

function nextStatus(status: TaskStatus) {
  const idx = columns.indexOf(status);
  return columns[Math.min(idx + 1, columns.length - 1)];
}

function label(status: TaskStatus) {
  switch (status) {
    case "BACKLOG":
      return "Backlog";
    case "TODO":
      return "Todo";
    case "DOING":
      return "Doing";
    case "DONE":
      return "Done";
    default:
      return status;
  }
}

type Props = {
  tasks: Task[];
};

export default function TaskBoard({ tasks }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const grouped = useMemo(() => {
    return columns.map((status) => ({
      status,
      items: tasks.filter((task) => task.status === status),
    }));
  }, [tasks]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description || undefined }),
    });
    setTitle("");
    setDescription("");
    startTransition(() => router.refresh());
  };

  const advanceTask = async (task: Task) => {
    if (task.status === "DONE") return;
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus(task.status) }),
    });
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-white">Create task</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder="Optional description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-50"
            onClick={handleCreate}
            disabled={isPending}
          >
            Add task
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {grouped.map((column) => (
          <div key={column.status} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100">{label(column.status)}</h3>
              <span className="text-xs text-slate-400">{column.items.length}</span>
            </div>
            <div className="space-y-3">
              {column.items.map((task) => (
                <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                  <div className="text-sm font-medium text-slate-100">{task.title}</div>
                  {task.description ? (
                    <div className="mt-1 text-xs text-slate-400">{task.description}</div>
                  ) : null}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Priority {task.priority}</span>
                    <button
                      className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 disabled:opacity-50"
                      onClick={() => advanceTask(task)}
                      disabled={task.status === "DONE"}
                    >
                      Advance
                    </button>
                  </div>
                </div>
              ))}
              {column.items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-800 p-3 text-xs text-slate-500">
                  No tasks here yet.
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
