"use client";

import { useState, type FormEvent } from "react";
import type { Task, TeamMember } from "@/lib/types";
import {
  priorityBadgeClasses,
  statusBadgeClasses,
  typeBadgeClasses,
  isOverdue,
  formatDate,
  formatDateTime,
} from "@/lib/uiHelpers";

function memberName(teamMembers: TeamMember[], id: string | null): string {
  if (!id) return "Unassigned";
  return teamMembers.find((m) => m.id === id)?.name ?? "Unknown";
}

export default function TaskCard({
  task,
  teamMembers,
  busy,
  onStart,
  onComplete,
  onReopen,
  onDelete,
  onAddFollowUp,
}: {
  task: Task;
  teamMembers: TeamMember[];
  busy: boolean;
  onStart: () => void;
  onComplete: () => void;
  onReopen: () => void;
  onDelete: () => void;
  onAddFollowUp: (text: string) => Promise<void>;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  const overdue = isOverdue(task.due_date, task.status);
  const notes = task.followup_notes ?? [];

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (submittingNote || !noteText.trim()) return;
    setSubmittingNote(true);
    try {
      await onAddFollowUp(noteText.trim());
      setNoteText("");
    } finally {
      setSubmittingNote(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-gray-400">{task.task_code}</span>
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            {overdue && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                Overdue
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600">{task.description}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadgeClasses(task.priority)}`}>
          {task.priority} Priority
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClasses(task.status)}`}>
          {task.status}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeClasses(task.task_type)}`}>
          {task.task_type}
        </span>
        {task.task_type === "Recurring" && task.recurring_frequency && (
          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-600">
            {task.recurring_frequency === "Custom"
              ? `Every ${task.recurring_custom_days} day(s)`
              : task.recurring_frequency}
          </span>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 sm:grid-cols-4">
        <div>
          <dt className="font-medium text-gray-400">Assigned To</dt>
          <dd className="text-gray-700">{memberName(teamMembers, task.assigned_to)}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-400">Created By</dt>
          <dd className="text-gray-700">{memberName(teamMembers, task.created_by)}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-400">Due Date</dt>
          <dd className={overdue ? "font-semibold text-red-600" : "text-gray-700"}>
            {formatDate(task.due_date)}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-400">Follow-ups</dt>
          <dd className="text-gray-700">{notes.length}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {task.status !== "In Progress" && task.status !== "Completed" && (
          <button
            type="button"
            disabled={busy}
            onClick={onStart}
            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Task
          </button>
        )}
        {task.status !== "Completed" && (
          <button
            type="button"
            disabled={busy}
            onClick={onComplete}
            className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark Complete
          </button>
        )}
        {task.status === "Completed" && (
          <button
            type="button"
            disabled={busy}
            onClick={onReopen}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reopen
          </button>
        )}
        <button
          type="button"
          onClick={() => setNotesOpen((v) => !v)}
          aria-expanded={notesOpen}
          className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          {notesOpen ? "Hide Follow-up" : "Add Follow-up"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onDelete}
          className="ml-auto rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {notesOpen && (
        <div className="mt-4 rounded-lg border border-gray-100 bg-bg-light/60 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Follow-up Notes
          </h4>
          <ul className="mt-2 space-y-2">
            {notes.length === 0 && (
              <li className="text-xs text-gray-400">No follow-up notes yet.</li>
            )}
            {notes
              .slice()
              .sort((a, b) => a.created_at.localeCompare(b.created_at))
              .map((note) => (
                <li key={note.id} className="rounded-md bg-white p-2 text-xs shadow-sm">
                  <p className="text-gray-700">{note.note_text}</p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {note.author_name} ({note.author_email}) · {formatDateTime(note.created_at)}
                  </p>
                </li>
              ))}
          </ul>

          <form onSubmit={handleAddNote} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <label htmlFor={`note-${task.id}`} className="sr-only">
              Add a follow-up note
            </label>
            <textarea
              id={`note-${task.id}`}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={2}
              placeholder="Add a follow-up note…"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
            />
            <button
              type="submit"
              disabled={submittingNote || !noteText.trim()}
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "#61375B" }}
            >
              {submittingNote ? "Saving…" : "Save Note"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
