"use client";

import { ReleaseNote } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  releases: ReleaseNote[];
};

export default function ReleasePanel({ releases }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [version, setVersion] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleCreate = async () => {
    if (!version.trim() || !title.trim() || !body.trim()) return;
    await fetch("/api/release-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version, title, body }),
    });
    setVersion("");
    setTitle("");
    setBody("");
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-white">Publish release note</h2>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-3 md:grid-cols-3">
            <input
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              placeholder="Version (e.g. 0.2.0)"
              value={version}
              onChange={(event) => setVersion(event.target.value)}
            />
            <input
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              placeholder="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
              onClick={handleCreate}
              disabled={isPending}
            >
              Publish
            </button>
          </div>
          <textarea
            className="min-h-[90px] rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder="Release notes summary"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {releases.map((release) => (
          <div key={release.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="text-xs text-slate-400">{release.version}</div>
            <div className="mt-1 text-base font-semibold text-white">{release.title}</div>
            <div className="mt-2 text-sm text-slate-300">{release.body}</div>
          </div>
        ))}
        {releases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-sm text-slate-500">
            No releases yet. Publish the first release note.
          </div>
        ) : null}
      </div>
    </div>
  );
}
