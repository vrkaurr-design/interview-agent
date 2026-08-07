"use client";

import React from "react";
import GlassPanel from "../shared/GlassPanel";
import { Quote } from "lucide-react";

interface SummaryPanelProps {
    summary: string;
}

export default function SummaryPanel({ summary }: SummaryPanelProps) {
    return (
        <GlassPanel className="p-6 relative select-text border border-primary/20 bg-primary/5 hover:shadow-[0_0_20px_rgba(109,94,245,0.05)] w-full bg-black/10">
            <Quote className="absolute -top-3 -left-3 w-8 h-8 text-primary/30 rotate-180" />
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Headlines Verdict
            </h3>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed font-semibold italic tracking-wide">
                "{summary}"
            </p>
        </GlassPanel>
    );
}
