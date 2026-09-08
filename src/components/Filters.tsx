"use client";

import type { TeamMember } from "@/lib/types";

export interface FilterState {
  priority: string;
  status: string;
  assignedTo: string;
}

export const DEFAULT_FILTERS: FilterState = { priority: "", status: "", assignedTo: "" };

export default function Filters({
  filters,
  onChange,
  teamMembers,
  onClear,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  teamMembers: TeamMember[];
  onClear: () => void;
}) {
  const hasActiveFilters = filters.priority || filters.status || filters.assignedTo;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div>
        <label htmlFor="filter-priority" className="sr-only">
          Filter by priority
        </label>
        <select
          id="filter-priority"
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div>
        <label htmlFor="filter-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Scheduled">Scheduled</option>
        </select>
      </div>

      <div>
        <label htmlFor="filter-assigned" className="sr-only">
          Filter by assigned team member
        </label>
        <select
          id="filter-assigned"
          value={filters.assignedTo}
          onChange={(e) => onChange({ ...filters, assignedTo: e.target.value })}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum"
        >
          <option value="">Everyone</option>
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-plum underline-offset-2 hover:underline"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
