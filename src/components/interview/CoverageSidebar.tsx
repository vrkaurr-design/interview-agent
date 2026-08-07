"use client";

import React from "react";
import GlassPanel from "../shared/GlassPanel";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "../../lib/utils";

interface CoverageSidebarProps {
    questionCount: number;
    coveredDays: number[];
    coveredModules: string[];
    isOpenMobile: boolean;
    onCloseMobile: () => void;
}

export default function CoverageSidebar({
    questionCount,
    coveredDays,
    coveredModules,
    isOpenMobile,
    onCloseMobile,
}: CoverageSidebarProps) {
    const minQuestions = 8;
    const minDays = 4;

    const questionProgress = Math.min((questionCount / minQuestions) * 100, 100);
    const daysProgress = Math.min((coveredDays.length / minDays) * 100, 100);

    const modulesList = [
        "React Hooks & Rendering",
        "State Management",
        "Next.js Routing & RSCs",
        "Graphics (Three.js)",
        "Testing & Integration",
        "Architecture & Builds"
    ];

    const isModuleCovered = (modName: string) => {
        return coveredModules.includes(modName);
    };

    const sidebarContent = (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar select-none text-white">
            <h2 className="font-bold text-xs border-b border-white/5 pb-4 mb-5 uppercase tracking-wider text-slate-300">
                Session Progress & Coverage
            </h2>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-slate-400 font-semibold">Questions Covered</span>
                        <span className="font-black tabular-nums">
                            {questionCount} <span className="text-slate-500 font-semibold">/ {minQuestions} Min</span>
                        </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${questionProgress}%` }}
                        />
                    </div>
                    {questionCount >= minQuestions && (
                        <span className="text-[10px] text-emerald-450 font-bold block mt-1.5 animate-pulse">
                            ✓ Minimum turns reached
                        </span>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-slate-400 font-semibold">Topics Covered</span>
                        <span className="font-black tabular-nums">
                            {coveredDays.length} <span className="text-slate-500 font-semibold">/ {minDays} Min</span>
                        </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                            className="bg-secondary h-full rounded-full transition-all duration-500"
                            style={{ width: `${daysProgress}%` }}
                        />
                    </div>
                    {coveredDays.length >= minDays && (
                        <span className="text-[10px] text-secondary font-bold block mt-1.5 animate-pulse">
                            ✓ Curriculum depth reached
                        </span>
                    )}
                </div>

                <div>
                    <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block mb-3">
                        Module coverage mapping
                    </span>
                    <div className="space-y-2.5">
                        {modulesList.map((modName, i) => {
                            const covered = isModuleCovered(modName);
                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs",
                                        covered
                                            ? "bg-primary/10 border-primary/20 text-slate-205"
                                            : "bg-white/5 border-white/5 text-slate-550"
                                    )}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {covered ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-450 shrink-0" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                                        )}
                                        <span className="font-semibold truncate">{modName}</span>
                                    </div>
                                    {covered && (
                                        <span className="text-[9px] bg-primary/25 text-primary font-black px-1.5 py-0.5 rounded shrink-0">
                                            MATCH
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <GlassPanel className="hidden md:flex flex-col w-[280px] h-full border-l border-white/10 p-5 shrink-0 rounded-none bg-black/10">
                {sidebarContent}
            </GlassPanel>

            {isOpenMobile && (
                <div className="fixed inset-0 z-50 md:hidden flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
                    <GlassPanel className="relative w-[280px] h-full border-l border-white/10 p-5 flex flex-col z-10 rounded-none">
                        {sidebarContent}
                    </GlassPanel>
                </div>
            )}
        </>
    );
}
