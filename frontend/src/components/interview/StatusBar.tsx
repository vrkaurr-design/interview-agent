"use client";

import React from "react";
import { AlertCircle, Activity, Cpu } from "lucide-react";

interface StatusBarProps {
    latency: number;
    turnCount: number;
    isLoading: boolean;
}

export default function StatusBar({ latency, turnCount, isLoading }: StatusBarProps) {
    return (
        <div className="w-full bg-black/60 border-t border-white/10 backdrop-blur-md px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-400 font-bold select-none h-8 shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 hover:text-slate-350 transition-colors">
                    <Activity className="w-3.5 h-3.5 text-secondary animate-pulse" />
                    <span className="font-semibold uppercase tracking-wider">Latency:</span>
                    {latency > 0 ? (
                        <span className="text-secondary font-black tabular-nums">{latency}ms</span>
                    ) : (
                        <span className="text-slate-500 font-medium">N/A</span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 hover:text-slate-350 transition-colors">
                    <AlertCircle className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold uppercase tracking-wider font-bold">Turns:</span>
                    <span className="text-primary font-black tabular-nums">{turnCount}</span>
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center gap-1.5 text-amber-400 font-black animate-pulse">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span className="uppercase tracking-wider">AI is auditing metrics...</span>
                </div>
            )}
        </div>
    );
}
