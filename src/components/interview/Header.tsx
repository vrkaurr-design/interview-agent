"use client";

import React, { useEffect, useState } from "react";
import { Timer, Power, Menu, BarChart2 } from "lucide-react";
import { Candidate } from "../../lib/types";

interface HeaderProps {
    candidate: Candidate;
    isLoading: boolean;
    onEndInterview: () => void;
    onToggleLeft: () => void;
    onToggleRight: () => void;
    done: boolean;
}

export default function Header({
    candidate,
    isLoading,
    onEndInterview,
    onToggleLeft,
    onToggleRight,
    done,
}: HeaderProps) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (done) return;
        const interval = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [done]);

    const formatTime = (totalSec: number) => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <header className="w-full bg-black/40 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleLeft}
                    className="md:hidden p-2 hover:bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2.5">
                    {candidate.avatar ? (
                        <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-9 h-9 rounded-lg object-cover border border-white/10"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary">
                            {getInitials(candidate.name)}
                        </div>
                    )}
                    <div>
                        <h1 className="font-bold text-white text-sm md:text-base leading-tight select-none">
                            {candidate.name}
                        </h1>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium">
                            {candidate.role}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 text-slate-350 text-xs md:text-sm font-semibold tracking-wide bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg select-none">
                    <Timer className="w-4 h-4 text-secondary" />
                    <span className="tabular-nums">{formatTime(seconds)}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold select-none">
                    <span className={`w-2.5 h-2.5 rounded-full ${isLoading ? "bg-amber-400" : "bg-emerald-400"} transition-all duration-300`} />
                    <span className="hidden sm:inline text-slate-400 text-[10px] uppercase tracking-wider">
                        {isLoading ? "AI Thinking" : "Connected"}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onEndInterview}
                    className="text-xs font-semibold text-caution hover:text-white bg-caution/10 border border-caution/20 hover:bg-caution/20 px-3.5 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(235,94,85,0.05)] cursor-pointer"
                >
                    <span className="flex items-center gap-1.5">
                        <Power className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">End Session</span>
                    </span>
                </button>

                <button
                    onClick={onToggleRight}
                    className="md:hidden p-2 hover:bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                    <BarChart2 className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
