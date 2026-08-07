"use client";

import React from "react";
import GlassPanel from "../shared/GlassPanel";
import { Candidate } from "../../lib/types";
import { BookOpen, AlertCircle, Award, Target, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface ProfileSidebarProps {
    candidate: Candidate;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    isOpenMobile: boolean;
    onCloseMobile: () => void;
}

export default function ProfileSidebar({
    candidate,
    isCollapsed,
    onToggleCollapse,
    isOpenMobile,
    onCloseMobile,
}: ProfileSidebarProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    const completed = candidate.completedMissions.filter((m) => m.completed);

    const skippedList = [
        "Vitest Mocking boundaries",
        "Webpack code splitting custom overrides",
        "R3F Orbit controls configuration",
        "Tailwind v4 theme variables migration"
    ].slice(0, candidate.skippedTopicsCount || 1);

    const sidebarContent = (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar select-none">
            <div className="border-b border-white/5 pb-4 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                    {getInitials(candidate.name)}
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-white text-sm truncate">{candidate.name}</h2>
                        <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 bg-white/5 border border-white/5 rounded-full mt-1 inline-block">
                            {candidate.experience} Exp
                        </span>
                    </div>
                )}
            </div>

            {!isCollapsed ? (
                <div className="space-y-6">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Learning Pulse</span>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-xl">
                            <Flame className="w-5 h-5 text-secondary animate-pulse" />
                            <div>
                                <span className="text-slate-400 text-[10px] font-medium block font-bold">Engagement:</span>
                                <span className={cn(
                                    "text-xs font-bold",
                                    candidate.learningSignals.engagement === 'High' && "text-emerald-400",
                                    candidate.learningSignals.engagement === 'Medium' && "text-amber-400",
                                    candidate.learningSignals.engagement === 'Low' && "text-caution"
                                )}>{candidate.learningSignals.engagement}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Modules</span>
                            <span className="text-[10px] text-emerald-450 font-extrabold bg-emerald-400/10 border border-emerald-450/20 px-1.5 py-0.5 rounded select-none">
                                {completed.length} Completed
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {completed.map((m, i) => (
                                <span key={i} className="text-[10px] bg-primary/10 border border-primary/20 text-slate-200 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                                    <BookOpen className="w-3 h-3 text-primary shrink-0" />
                                    {m.module}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Skipped Modules</span>
                        {candidate.skippedTopicsCount === 0 ? (
                            <p className="text-[11px] text-slate-500 font-medium">None. All modules finalized.</p>
                        ) : (
                            <div className="flex flex-wrap gap-1.5">
                                {skippedList.map((st, i) => (
                                    <span key={i} className="text-[10px] bg-caution/15 border border-caution/25 text-slate-300 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 text-caution shrink-0" />
                                        {st}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Strengths</span>
                            <ul className="space-y-1.5">
                                {candidate.learningSignals.strengths.map((str, i) => (
                                    <li key={i} className="text-xs font-semibold text-slate-300 flex items-start gap-2">
                                        <Award className="w-3.5 h-3.5 text-strength mt-0.5 shrink-0" />
                                        <span>{str}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Target growth</span>
                            <ul className="space-y-1.5">
                                {candidate.learningSignals.gaps.map((gap, i) => (
                                    <li key={i} className="text-xs font-semibold text-slate-350 flex items-start gap-2">
                                        <Target className="w-3.5 h-3.5 text-caution mt-0.5 shrink-0" />
                                        <span>{gap}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6 mt-4">
                    <Tooltip text="Learning Pulse">
                        <Flame className="w-5 h-5 text-secondary" />
                    </Tooltip>

                    <Tooltip text={`${completed.length} Completed`}>
                        <div className="relative">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-[8px] text-white font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-black scale-90">
                                {completed.length}
                            </span>
                        </div>
                    </Tooltip>

                    <Tooltip text={`${candidate.skippedTopicsCount} Skipped`}>
                        <div className="relative">
                            <AlertCircle className="w-5 h-5 text-caution" />
                            {candidate.skippedTopicsCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-caution text-[8px] text-white font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-black scale-90">
                                    {candidate.skippedTopicsCount}
                                </span>
                            )}
                        </div>
                    </Tooltip>
                </div>
            )}
        </div>
    );

    return (
        <>
            <GlassPanel
                className={cn(
                    "hidden md:flex flex-col h-full border-r border-white/10 relative transition-all duration-300 px-4 py-4 shrink-0 rounded-none bg-black/10",
                    isCollapsed ? "w-[72px]" : "w-[280px]"
                )}
            >
                <button
                    onClick={onToggleCollapse}
                    className="absolute -right-3 top-16 bg-black border border-white/15 hover:border-white/30 text-white rounded-full p-0.5 cursor-pointer shadow-lg z-20"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                {sidebarContent}
            </GlassPanel>

            {isOpenMobile && (
                <div className="fixed inset-0 z-50 md:hidden flex justify-start">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
                    <GlassPanel className="relative w-[280px] h-full border-r border-white/10 p-5 flex flex-col z-10 rounded-none">
                        {sidebarContent}
                    </GlassPanel>
                </div>
            )}
        </>
    );
}

function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
    return (
        <div className="relative group flex justify-center cursor-pointer">
            {children}
            <span className="absolute left-10 scale-0 transition-all rounded bg-slate-900 border border-white/15 p-2 text-xs font-semibold text-white group-hover:scale-100 z-30 pointer-events-none whitespace-nowrap">
                {text}
            </span>
        </div>
    );
}
