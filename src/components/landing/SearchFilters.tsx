"use client";

import React, { useState, useEffect } from "react";
import { useCandidatesStore } from "../../hooks/useCandidates";
import GlassPanel from "../shared/GlassPanel";
import { Search, X, SlidersHorizontal } from "lucide-react";

export default function SearchFilters() {
    const {
        searchQuery,
        setSearchQuery,
        selectedModules,
        toggleModule,
        selectedEngagements,
        toggleEngagement,
        minProgress,
        setMinProgress,
        resetFilters,
    } = useCandidatesStore();

    const [localSearch, setLocalSearch] = useState(searchQuery);

    // Debouncing search strings
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, setSearchQuery]);

    const modules = [
        "React Hooks",
        "State Management",
        "Performance UI",
        "NextJS Routing",
        "ThreeJS Fiber",
        "CSS Architecture"
    ];

    const engagements: ('Low' | 'Medium' | 'High')[] = ["High", "Medium", "Low"];

    const hasActiveFilters =
        localSearch !== "" ||
        selectedModules.length > 0 ||
        selectedEngagements.length > 0 ||
        minProgress > 0;

    const handleClearAll = () => {
        setLocalSearch("");
        resetFilters();
    };

    return (
        <div className="sticky top-4 z-40 max-w-6xl mx-auto px-4 mb-8">
            <GlassPanel className="p-4 md:p-6 shadow-2xl backdrop-blur-3xl border border-white/10 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-white tracking-tight">Search & Filter Matrix</h2>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={handleClearAll}
                            className="self-end md:self-auto text-xs text-secondary hover:text-white flex items-center gap-1.5 bg-secondary/15 hover:bg-secondary/25 px-3 py-1.5 rounded-lg border border-secondary/20 transition-all font-medium"
                        >
                            Clear Filters
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                    {/* Name Search */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Search Candidate</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Type a name..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                            {localSearch && (
                                <button
                                    onClick={() => setLocalSearch("")}
                                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Module Coverage */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Module Coverage</label>
                        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none custom-scrollbar">
                            {modules.map((mod) => {
                                const isActive = selectedModules.includes(mod);
                                return (
                                    <button
                                        key={mod}
                                        onClick={() => toggleModule(mod)}
                                        className={`shrink-0 text-xs px-3.5 py-2.5 rounded-xl border transition-all ${isActive
                                                ? "bg-primary border-primary text-white shadow-[0_0_10px_rgba(109,94,245,0.4)]"
                                                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                                            }`}
                                    >
                                        {mod}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Engagement + Slider */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Engagement</label>
                            <div className="flex gap-1 bg-black/35 p-1 rounded-xl border border-white/5">
                                {engagements.map((eng) => {
                                    const isActive = selectedEngagements.includes(eng);
                                    return (
                                        <button
                                            key={eng}
                                            onClick={() => toggleEngagement(eng)}
                                            className={`flex-1 text-center py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${isActive
                                                    ? "bg-primary/20 text-primary border-primary/30"
                                                    : "text-slate-400 hover:text-slate-200 border-transparent"
                                                }`}
                                        >
                                            {eng}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min Progress</label>
                                <span className="text-xs font-bold text-secondary analytics-nums">{minProgress}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={minProgress}
                                onChange={(e) => setMinProgress(Number(e.target.value))}
                                className="w-full accent-secondary bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer border border-white/5"
                            />
                        </div>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}
