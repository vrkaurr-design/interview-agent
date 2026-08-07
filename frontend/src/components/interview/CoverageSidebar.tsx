"use client";

import React from "react";
import Panel from "../shared/ui/Panel";
import StatusChip from "../shared/ui/StatusChip";
import { cn } from "../../lib/utils";

interface CoverageSidebarProps {
  questionCount: number;
  coveredDays: number[];
  coveredModules: string[];
  coverage: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function CoverageSidebar({
  questionCount,
  coveredDays,
  coveredModules,
  coverage,
  isOpenMobile,
  onCloseMobile,
}: CoverageSidebarProps) {
  const minQuestions = 8;
  const minDays = 4;

  const questionProgress = Math.min((questionCount / minQuestions) * 100, 100);
  const daysProgress = Math.min((coveredDays.length / minDays) * 105, 100);

  const modulesList = [
    "React Hooks & Rendering",
    "State Management",
    "Next.js Routing & RSCs",
    "Graphics (Three.js)",
    "Testing & Integration",
    "Architecture & Builds",
  ];

  const isModuleCovered = (modName: string) => {
    return coveredModules.includes(modName);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar select-none text-text-primary">
      {/* Large Coverage Readout with Bebas Neue scale numerals */}
      <div className="flex flex-col gap-space-1 border-b border-hairline pb-space-5 mb-space-5">
        <span className="text-[10px] tracking-wider uppercase font-body text-text-muted font-semibold">
          Curriculum Coverage
        </span>
        <div className="flex items-baseline font-display text-text-primary">
          <span className="text-6xl tracking-wide leading-none font-medium">
            {coverage}
          </span>
          <span className="text-lg text-text-muted ml-space-1 font-semibold font-body">
            %
          </span>
        </div>
      </div>

      <div className="space-y-space-6">
        {/* Telemetry rows */}
        <div>
          <div className="flex justify-between items-center text-xs mb-space-2 font-body">
            <span className="text-text-muted font-semibold">Questions Covered</span>
            <span className="font-mono font-bold text-text-primary">
              {questionCount} <span className="text-text-muted font-semibold">/ {minQuestions} Min</span>
            </span>
          </div>
          <div className="w-full bg-surface h-[2px] rounded-none overflow-hidden border border-hairline">
            <div
              className="bg-accent-focus h-full transition-all duration-500"
              style={{ width: `${questionProgress}%` }}
            />
          </div>
          {questionCount >= minQuestions && (
            <span className="text-[9px] text-accent-confirm font-mono font-bold block mt-space-1.5 uppercase">
              ✓ Minimum turns reached
            </span>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-space-2 font-body">
            <span className="text-text-muted font-semibold">Curriculum Days</span>
            <span className="font-mono font-bold text-text-primary">
              {coveredDays.length} <span className="text-text-muted font-semibold">/ {minDays} Min</span>
            </span>
          </div>
          <div className="w-full bg-surface h-[2px] rounded-none overflow-hidden border border-hairline">
            <div
              className="bg-accent-resolve h-full transition-all duration-500"
              style={{ width: `${daysProgress}%` }}
            />
          </div>
          {coveredDays.length >= minDays && (
            <span className="text-[9px] text-accent-resolve font-mono font-bold block mt-space-1.5 uppercase">
              ✓ Depth target reached
            </span>
          )}
        </div>

        {/* Modules List */}
        <div>
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-space-3 font-body">
            Module coverage mapping
          </span>
          <div className="space-y-space-2.5">
            {modulesList.map((modName, i) => {
              const covered = isModuleCovered(modName);
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between p-space-3 rounded-none border transition-all text-xs",
                    covered
                      ? "bg-accent-confirm/5 border-accent-confirm/20 text-text-primary"
                      : "bg-[#14171C]/40 border-hairline text-text-muted"
                  )}
                >
                  <span className="font-semibold font-body truncate mr-space-2">{modName}</span>
                  <StatusChip
                    status={covered ? "confirm" : "resolve"}
                    label={covered ? "COVERED" : "PENDING"}
                  />
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
      <Panel className="hidden md:flex flex-col w-[290px] h-full border-l border-hairline p-space-5 shrink-0 rounded-none bg-[#14171C]/50 backdrop-blur-lg">
        {sidebarContent}
      </Panel>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <Panel className="relative w-[285px] h-full border-l border-hairline p-space-5 flex flex-col z-10 rounded-none bg-[#14171C]/90">
            {sidebarContent}
          </Panel>
        </div>
      )}
    </>
  );
}
