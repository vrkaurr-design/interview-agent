import React from "react";

export default function FocusRail() {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-[4px] z-50 pointer-events-none hidden md:flex flex-col justify-start">
      {/* Vertical hairline */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-accent-focus/20" />
      {/* Horizontal ticks every 80px */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[4px]"
        style={{
          backgroundImage: "linear-gradient(to bottom, var(--accent-focus) 1px, transparent 1px)",
          backgroundSize: "100% 80px",
          opacity: 0.35,
        }}
      />
    </div>
  );
}
