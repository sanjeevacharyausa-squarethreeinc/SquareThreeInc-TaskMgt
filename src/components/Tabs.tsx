"use client";

export type TabKey = "All" | "Recurring" | "One-time" | "Follow-up" | "Completed";

const TABS: { key: TabKey; label: string }[] = [
  { key: "All", label: "All Tasks" },
  { key: "Recurring", label: "Recurring" },
  { key: "One-time", label: "One-time" },
  { key: "Follow-up", label: "Follow-up" },
  { key: "Completed", label: "Completed" },
];

export default function Tabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <div role="tablist" aria-label="Task categories" className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition"
            style={
              isActive
                ? { backgroundColor: "#61375B", color: "white" }
                : { backgroundColor: "white", color: "#3F1F3A", border: "1px solid #E5DDE4" }
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
