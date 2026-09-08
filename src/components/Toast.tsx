"use client";

export interface ToastState {
  type: "success" | "error";
  message: string;
}

export default function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState | null;
  onDismiss: () => void;
}) {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg"
      style={{
        backgroundColor: toast.type === "success" ? "#F0FDF4" : "#FEF2F2",
        borderColor: toast.type === "success" ? "#BBF7D0" : "#FECACA",
        color: toast.type === "success" ? "#166534" : "#B91C1C",
      }}
    >
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-auto text-sm font-semibold opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
