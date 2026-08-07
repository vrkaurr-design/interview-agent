"use client";

import React from "react";
import Panel from "../shared/ui/Panel";
import { Quote } from "lucide-react";

interface SummaryPanelProps {
  summary: string;
}

export default function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <Panel className="p-space-6 relative select-text border-l-2 border-l-accent-focus/80">
      <Quote className="absolute -top-3 -left-3 w-8 h-8 text-accent-focus/15 rotate-180" />
      <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-space-3 font-body">
        Headlines Verdict
      </h3>
      <p className="text-base md:text-lg text-text-primary leading-relaxed font-body font-semibold italic tracking-wide">
        "{summary}"
      </p>
    </Panel>
  );
}
