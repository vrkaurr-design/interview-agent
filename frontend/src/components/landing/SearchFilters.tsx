"use client";

import React, { useState, useEffect } from "react";
import { useCandidatesStore } from "../../hooks/useCandidates";
import Panel from "../shared/ui/Panel";
import StatusChip from "../shared/ui/StatusChip";
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
    "CSS Architecture",
  ];

  const engagements: ("Low" | "Medium" | "High")[] = ["High", "Medium", "Low"];

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
    <div className="sticky top-4 z-30 max-w-6xl mx-auto px-space-6 mb-space-8">
      <Panel className="p-space-4 md:p-space-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-4 border-b border-hairline pb-space-3 mb-space-4">
          <div className="flex items-center gap-space-2">
            <SlidersHorizontal className="w-4 h-4 text-accent-focus" />
            <h2 className="font-body text-xs font-semibold text-text-primary tracking-wider uppercase">
              Search & Filter Matrix
            </h2>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="self-end md:self-auto text-[10px] font-mono font-bold text-accent-resolve hover:text-text-primary flex items-center gap-space-1.5 bg-accent-resolve/10 hover:bg-accent-resolve/20 px-space-3 py-1 border border-accent-resolve/20 rounded-sm transition-all cursor-pointer"
            >
              Clear Filters
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-6">
          {/* Name Search */}
          <div className="relative">
            <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-space-2 font-body">
              Search Candidate
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type a name..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-transparent border-b border-hairline py-space-2 pl-space-8 pr-space-8 text-sm text-text-primary placeholder-text-muted/40 focus:outline-none focus:border-accent-focus transition-all"
              />
              <Search className="w-4 h-4 text-text-muted absolute left-1 top-2.5" />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch("")}
                  className="absolute right-1 top-2.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Module Coverage */}
          <div>
            <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-space-2 font-body">
              Module Coverage
            </label>
            <div className="flex gap-space-2 overflow-x-auto pb-space-2 max-w-full scrollbar-none custom-scrollbar">
              {modules.map((mod) => {
                const isActive = selectedModules.includes(mod);
                return (
                  <button
                    key={mod}
                    onClick={() => toggleModule(mod)}
                    className="shrink-0 focus:outline-none cursor-pointer"
                  >
                    {isActive ? (
                      <StatusChip status="focus" label={mod} />
                    ) : (
                      <span className="inline-flex items-center px-space-2 py-[2px] rounded-sm text-[10px] font-semibold border border-hairline text-text-muted hover:text-text-primary transition-all">
                        {mod}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Engagement + Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-4">
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-space-2 font-body">
                Engagement
              </label>
              <div className="flex gap-space-2 bg-transparent py-0.5">
                {engagements.map((eng) => {
                  const isActive = selectedEngagements.includes(eng);
                  return (
                    <button
                      key={eng}
                      onClick={() => toggleEngagement(eng)}
                      className="focus:outline-none cursor-pointer"
                    >
                      {isActive ? (
                        <StatusChip status="confirm" label={eng} />
                      ) : (
                        <span className="inline-flex items-center px-space-2 py-[2px] rounded-sm text-[10px] font-semibold border border-hairline text-text-muted hover:text-text-primary transition-all">
                          {eng}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-space-2">
                <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider font-body">
                  Min Progress
                </label>
                <span className="text-xs font-mono font-bold text-accent-confirm">
                  {minProgress}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minProgress}
                onChange={(e) => setMinProgress(Number(e.target.value))}
                className="w-full accent-accent-confirm bg-surface h-1 rounded-none appearance-none cursor-pointer border border-hairline"
              />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
