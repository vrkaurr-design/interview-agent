"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import GlassPanel from "../shared/GlassPanel";

interface RecommendationsProps {
    recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
    return (
        <GlassPanel className="p-6 hover:shadow-[0_0_30px_rgba(109,94,245,0.1)] bg-black/10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                Actionable Recommendations
            </h3>

            {recommendations.length === 0 ? (
                <span className="text-xs text-slate-500 font-medium">None available.</span>
            ) : (
                <ol className="space-y-4">
                    {recommendations.map((rec, idx) => (
                        <li
                            key={idx}
                            className="flex items-start gap-3.5 text-sm text-slate-200 font-semibold leading-relaxed border-l-2 border-primary/20 pl-4 py-1 hover:border-primary/50 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                            <span>{rec}</span>
                        </li>
                    ))}
                </ol>
            )}
        </GlassPanel>
    );
}
