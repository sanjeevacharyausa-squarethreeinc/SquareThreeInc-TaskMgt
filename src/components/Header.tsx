"use client";

import type { CurrentUser } from "@/lib/types";

export default function Header({
  currentUser,
  onRefresh,
  onNewTask,
  onSignOut,
  refreshing,
  signingOut,
}: {
  currentUser: CurrentUser;
  onRefresh: () => void;
  onNewTask: () => void;
  onSignOut: () => void;
  refreshing: boolean;
  signingOut: boolean;
}) {
  return (
    <header style={{ backgroundColor: "#3F1F3A" }} className="sticky top-0 z-30 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            style={{ backgroundColor: "#F2B84B", color: "#3F1F3A" }}
            aria-hidden="true"
          >
            {currentUser.initials}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{currentUser.name}</p>
            <p className="text-xs leading-tight text-white/70">Private Operations Workspace</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh tasks"
            className="rounded-lg border border-white/30 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={onNewTask}
            className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:opacity-90"
            style={{ backgroundColor: "#F2B84B", color: "#3F1F3A" }}
          >
            + New Task
          </button>
          <button
            type="button"
            onClick={onSignOut}
            disabled={signingOut}
            className="rounded-lg border border-white/30 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </div>
    </header>
  );
}
