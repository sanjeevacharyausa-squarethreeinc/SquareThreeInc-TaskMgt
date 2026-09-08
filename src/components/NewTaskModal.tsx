"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { TeamMember } from "@/lib/types";

export interface NewTaskPayload {
  title: string;
  description: string;
  priority: string;
  task_type: string;
  assigned_to: string;
  due_date: string;
  recurring_frequency: string | null;
  recurring_custom_days: number | null;
}

export default function NewTaskModal({
  teamMembers,
  onClose,
  onCreate,
}: {
  teamMembers: TeamMember[];
  onClose: () => void;
  onCreate: (payload: NewTaskPayload) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [taskType, setTaskType] = useState("One-time");
  const [assignedTo, setAssignedTo] = useState(teamMembers[0]?.id ?? "");
  const [dueDate, setDueDate] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [customDays, setCustomDays] = useState("7");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (!title.trim()) return setError("Title is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!dueDate) return setError("Due date is required.");
    if (taskType === "Recurring" && frequency === "Custom") {
      const days = Number(customDays);
      if (!Number.isFinite(days) || days < 1) {
        return setError("Enter a valid number of days for custom recurrence.");
      }
    }

    setSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        priority,
        task_type: taskType,
        assigned_to: assignedTo,
        due_date: dueDate,
        recurring_frequency: taskType === "Recurring" ? frequency : null,
        recurring_custom_days:
          taskType === "Recurring" && frequency === "Custom" ? Number(customDays) : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task.");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-task-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="new-task-title" className="text-lg font-semibold text-plum-deep">
            New Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-xl leading-none text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-gray-700">
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
            />
          </div>

          <div>
            <label htmlFor="task-description" className="mb-1 block text-sm font-medium text-gray-700">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="task-description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-priority" className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-type" className="mb-1 block text-sm font-medium text-gray-700">
                Task Type
              </label>
              <select
                id="task-type"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
              >
                <option value="One-time">One-time</option>
                <option value="Recurring">Recurring</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>
          </div>

          {taskType === "Recurring" && (
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-violet-50 p-3">
              <div>
                <label htmlFor="task-frequency" className="mb-1 block text-sm font-medium text-gray-700">
                  Recurring Frequency
                </label>
                <select
                  id="task-frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              {frequency === "Custom" && (
                <div>
                  <label htmlFor="task-custom-days" className="mb-1 block text-sm font-medium text-gray-700">
                    Every N Days
                  </label>
                  <input
                    id="task-custom-days"
                    type="number"
                    min={1}
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
                  />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-assigned" className="mb-1 block text-sm font-medium text-gray-700">
                Assigned Team Member
              </label>
              <select
                id="task-assigned"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-due" className="mb-1 block text-sm font-medium text-gray-700">
                Due Date <span className="text-red-600">*</span>
              </label>
              <input
                id="task-due"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "#61375B" }}
            >
              {submitting ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
