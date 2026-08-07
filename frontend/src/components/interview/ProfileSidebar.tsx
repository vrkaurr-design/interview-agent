"use client";

import React from "react";
import Panel from "../shared/ui/Panel";
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
    "Tailwind v4 theme variables migration",
  ].slice(0, candidate.skippedTopicsCount || 1);

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar select-none text-text-primary">
      {/* Header containing the candidate photo frame with corner brackets */}
      <div className="border-b border-hairline pb-space-4 mb-space-4 flex items-center gap-space-3">
        <div className="relative w-12 h-12 shrink-0">
          {/* Corner brackets mimicking camera framing */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent-focus" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent-focus" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent-focus" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent-focus" />

          {/* Photo inner image */}
          <div className="w-full h-full p-[2px] bg-transparent">
            {candidate.avatar ? (
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-full h-full object-cover rounded-none"
              />
            ) : (
              <div className="w-full h-full bg-surface-raised border border-hairline flex items-center justify-center font-bold text-[10px] text-accent-focus">
                {getInitials(candidate.name)}
              </div>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="overflow-hidden">
            <h2 className="font-semibold text-text-primary text-sm truncate font-body tracking-wide">
              {candidate.name}
            </h2>
            <span className="text-[9px] text-text-muted font-mono font-bold px-space-2 py-[2px] bg-surface-raised border border-hairline rounded-sm mt-1 inline-block">
              {candidate.experience} EXP
            </span>
          </div>
        )}
      </div>

      {!isCollapsed ? (
        <div className="space-y-space-6">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-space-2 font-body">
              Learning Pulse
            </span>
            <div className="flex items-center gap-space-2 bg-surface-raised/40 border border-hairline p-space-2 rounded-none">
              <Flame className="w-4 h-4 text-accent-resolve animate-pulse" />
              <div>
                <span className="text-text-muted text-[10px] font-semibold block font-body">
                  ENGAGEMENT:
                </span>
                <span
                  className={cn(
                    "text-xs font-bold font-mono",
                    candidate.learningSignals.engagement === "High" && "text-accent-confirm",
                    candidate.learningSignals.engagement === "Medium" && "text-accent-resolve",
                    candidate.learningSignals.engagement === "Low" && "text-accent-focus"
                  )}
                >
                  {candidate.learningSignals.engagement}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-space-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-body">
                Completed Modules
              </span>
              <span className="text-[9px] text-accent-confirm font-mono font-bold bg-accent-confirm/10 border border-accent-confirm/20 px-space-1.5 py-0.5 rounded-sm">
                {completed.length} COMPLETE
              </span>
            </div>
            <div className="flex flex-wrap gap-space-1.5">
              {completed.map((m, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-surface-raised border border-hairline text-text-primary px-space-2 py-[2px] rounded-sm font-semibold font-body flex items-center gap-space-1"
                >
                  <BookOpen className="w-3 h-3 text-accent-focus shrink-0" />
                  {m.module}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-space-2 font-body">
              Skipped Modules
            </span>
            {candidate.skippedTopicsCount === 0 ? (
              <p className="text-[10px] text-text-muted font-body font-semibold">
                None. All modules finalized.
              </p>
            ) : (
              <div className="flex flex-wrap gap-space-1.5">
                {skippedList.map((st, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-surface-raised border border-hairline text-text-muted px-space-2 py-[2px] rounded-sm font-semibold font-body flex items-center gap-space-1"
                  >
                    <AlertCircle className="w-3 h-3 text-accent-resolve shrink-0" />
                    {st}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-space-4 border-t border-hairline pt-space-4">
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-space-2 font-body">
                Strengths
              </span>
              <ul className="space-y-space-1.5">
                {candidate.learningSignals.strengths.map((str, i) => (
                  <li key={i} className="text-xs font-semibold text-text-primary flex items-start gap-space-2 font-body">
                    <Award className="w-3.5 h-3.5 text-accent-confirm mt-0.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-space-2 font-body">
                Target growth
              </span>
              <ul className="space-y-space-1.5">
                {candidate.learningSignals.gaps.map((gap, i) => (
                  <li key={i} className="text-xs font-semibold text-text-primary flex items-start gap-space-2 font-body">
                    <Target className="w-3.5 h-3.5 text-accent-focus mt-0.5 shrink-0" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-space-6 mt-space-4">
          <Tooltip text="Learning Pulse">
            <Flame className="w-5 h-5 text-accent-resolve" />
          </Tooltip>

          <Tooltip text={`${completed.length} Completed`}>
            <div className="relative">
              <BookOpen className="w-5 h-5 text-accent-focus" />
              <span className="absolute -top-1.5 -right-1.5 bg-accent-confirm text-[8px] text-[#0B0D10] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-hairline scale-90">
                {completed.length}
              </span>
            </div>
          </Tooltip>

          <Tooltip text={`${candidate.skippedTopicsCount} Skipped`}>
            <div className="relative">
              <AlertCircle className="w-5 h-5 text-accent-focus" />
              {candidate.skippedTopicsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent-focus text-[8px] text-[#0B0D10] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-hairline scale-90">
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
      <Panel
        className={cn(
          "hidden md:flex flex-col h-full border-r border-hairline relative transition-all duration-300 px-space-4 py-space-4 shrink-0 rounded-none bg-[#14171C]/50 backdrop-blur-lg",
          isCollapsed ? "w-[72px]" : "w-[280px]"
        )}
      >
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-16 bg-[#14171C] border border-hairline hover:border-accent-focus text-text-primary rounded-full p-0.5 cursor-pointer shadow-lg z-20"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        {sidebarContent}
      </Panel>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-start">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <Panel className="relative w-[280px] h-full border-r border-hairline p-space-5 flex flex-col z-10 rounded-none bg-[#14171C]/90">
            {sidebarContent}
          </Panel>
        </div>
      )}
    </>
  );
}

function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <div className="relative group flex justify-center cursor-pointer">
      {children}
      <span className="absolute left-10 scale-0 transition-all rounded bg-[#14171C] border border-hairline p-space-2 text-xs font-semibold text-text-primary group-hover:scale-100 z-30 pointer-events-none whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}
