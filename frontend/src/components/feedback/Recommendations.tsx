"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Panel from "../shared/ui/Panel";

interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <Panel className="p-space-6 flex flex-col">
      <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-space-5 font-body">
        Actionable Recommendations
      </h3>

      {recommendations.length === 0 ? (
        <span className="text-xs text-text-muted font-body font-semibold">None available.</span>
      ) : (
        <ol className="space-y-space-4">
          {recommendations.map((rec, idx) => (
            <li
              key={idx}
              className="flex items-start gap-space-3.5 text-sm text-text-primary font-body font-semibold leading-relaxed border-l-2 border-accent-focus/20 pl-space-4 py-0.5 hover:border-accent-focus transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-accent-focus shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
