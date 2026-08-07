import React from "react";

interface DataReadoutProps {
  label: string;
  value: string | number;
  unit?: string;
}

export default function DataReadout({ label, value, unit }: DataReadoutProps) {
  return (
    <div className="flex flex-col gap-space-1">
      <span className="text-[10px] tracking-wider uppercase font-body text-text-muted font-semibold">
        {label}
      </span>
      <div className="flex items-baseline font-mono text-text-primary">
        <span className="text-2xl font-semibold leading-none tracking-tight tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-text-muted ml-0.5 font-medium font-body uppercase">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
