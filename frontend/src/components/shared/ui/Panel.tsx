import React from "react";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Panel({ children, className = "", id }: PanelProps) {
  return (
    <div
      id={id}
      className={`bg-surface-raised border border-hairline backdrop-blur-[8px] rounded-md ${className}`}
    >
      {children}
    </div>
  );
}
