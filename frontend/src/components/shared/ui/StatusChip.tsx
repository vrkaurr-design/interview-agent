import React from "react";

interface StatusChipProps {
  status: "focus" | "resolve" | "confirm";
  label?: string;
}

const statusConfig = {
  focus: {
    bg: "bg-accent-focus/12",
    text: "text-accent-focus",
    label: "FOCUS",
  },
  resolve: {
    bg: "bg-accent-resolve/12",
    text: "text-accent-resolve",
    label: "RESOLVE",
  },
  confirm: {
    bg: "bg-accent-confirm/12",
    text: "text-accent-confirm",
    label: "CONFIRM",
  },
};

export default function StatusChip({ status, label }: StatusChipProps) {
  const config = statusConfig[status] || statusConfig.focus;
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center px-space-2 py-[2px] rounded-sm text-[10px] font-semibold tracking-wider font-mono ${config.bg} ${config.text}`}
    >
      {displayLabel}
    </span>
  );
}
