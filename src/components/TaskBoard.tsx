"use client";

import { Task, TaskStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

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
  tasks: TaskLite[];
};

type TaskLite = Pick<Task, "id" | "title" | "description" | "status" | "priority">;

const storageKey = "able.tasks";

function readStoredTasks(): TaskLite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TaskLite[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => Boolean(item?.id && item?.title));
  } catch {
    return [];
  }
}

function persistTasks(items: TaskLite[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Ignore storage errors (private mode, quota).
  }
}

export default function TaskBoard({ tasks }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localTasks, setLocalTasks] = useState<TaskLite[]>(tasks);

  useEffect(() => {
    if (tasks.length > 0) {
      setLocalTasks(tasks);
      persistTasks(tasks);
      return;
    }

    const stored = readStoredTasks();
    if (stored.length > 0) {
      setLocalTasks(stored);
    }
  }, [tasks]);

  const grouped = useMemo(() => {
    return columns.map((status) => ({
      status,
      items: localTasks.filter((task) => task.status === status),
    }));
  }, [localTasks]);

  const handleCreate = async () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 2) {
      setError("Title must be at least 2 characters.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          description: description.trim() ? description : undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.error?.formErrors?.join?.(", ") ||
          payload?.error?.fieldErrors?.title?.join?.(", ") ||
          payload?.error?.message ||
          "Failed to save task.";
        setError(message);
      } else {
        const payload = (await response.json().catch(() => null)) as { data?: Task } | null;
        if (payload?.data?.id) {
          const created: TaskLite = {
            id: payload.data.id,
            title: payload.data.title,
            description: payload.data.description ?? null,
            status: payload.data.status,
            priority: payload.data.priority,
          };
          setLocalTasks((prev) => {
            const next = [created, ...prev.filter((item) => item.id !== created.id)];
            persistTasks(next);
            return next;
          });
          startTransition(() => router.refresh());
        }
        setTitle("");
        setDescription("");
      }
    } catch {
      const fallback: TaskLite = {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
        title: trimmedTitle,
        description: description.trim() ? description : null,
        status: "BACKLOG",
        priority: 3,
      };
      setLocalTasks((prev) => {
        const next = [fallback, ...prev];
        persistTasks(next);
        return next;
      });
      setTitle("");
      setDescription("");
    } finally {
      setIsSaving(false);
    }
  };

  const advanceTask = async (task: TaskLite) => {
    if (task.status === "DONE") return;
    const next = nextStatus(task.status);
    setLocalTasks((prev) => {
      const updated = prev.map((item) => (item.id === task.id ? { ...item, status: next } : item));
      persistTasks(updated);
      return updated;
    });

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (response.ok) {
        startTransition(() => router.refresh());
      }
    } catch {
      // Keep local state even if API fails.
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-white">Create task</h2>
        {error ? (
          <div className="mt-3 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            {error}
          </div>
        ) : null}
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
            disabled={isPending || isSaving}
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
