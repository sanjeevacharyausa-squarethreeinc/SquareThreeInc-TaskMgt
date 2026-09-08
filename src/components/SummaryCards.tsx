"use client";

interface Summary {
  total: number;
  highPriority: number;
  inProgress: number;
  recurring: number;
  completed: number;
}

export default function SummaryCards({ summary }: { summary: Summary }) {
  const cards: { label: string; value: number; accent: string }[] = [
    { label: "Total Tasks", value: summary.total, accent: "#61375B" },
    { label: "High Priority", value: summary.highPriority, accent: "#DC2626" },
    { label: "In Progress", value: summary.inProgress, accent: "#2563EB" },
    { label: "Recurring", value: summary.recurring, accent: "#7C3AED" },
    { label: "Completed", value: summary.completed, accent: "#16A34A" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl bg-white p-4 shadow-sm"
          style={{ borderTop: `3px solid ${card.accent}` }}
        >
          <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}
