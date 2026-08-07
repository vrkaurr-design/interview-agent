"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCandidatesStore } from "../../hooks/useCandidates";
import Panel from "../shared/ui/Panel";
import DataReadout from "../shared/ui/DataReadout";
import StatusChip from "../shared/ui/StatusChip";
import { ArrowRight } from "lucide-react";
import { Candidate } from "../../lib/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CandidateGrid() {
  const router = useRouter();
  const getFilteredCandidates = useCandidatesStore((state) => state.getFilteredCandidates);
  const filteredCandidates = getFilteredCandidates();
  const gridRef = useRef<HTMLDivElement>(null);

  const handleStartInterview = (candidateId: string) => {
    const sessionId =
      typeof window !== "undefined" && window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    router.push(`/interview/${candidateId}?sessionId=${sessionId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    if (filteredCandidates.length === 0) return;

    const cards = gridRef.current?.querySelectorAll(".candidate-card");
    if (!cards || cards.length === 0) return;

    // Reset properties before animating to avoid layout jumps on filters
    gsap.set(cards, { opacity: 0, y: 15, filter: "blur(2px)" });

    const anim = gsap.to(cards, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [filteredCandidates]);

  return (
    <section id="candidate-grid-section" className="max-w-6xl mx-auto px-space-6 py-space-12 scroll-mt-24">
      {/* Title header */}
      <div className="mb-space-8 flex flex-col md:flex-row md:items-end justify-between gap-space-4">
        <div>
          <h2 className="text-3xl font-display text-text-primary tracking-wide">
            ACTIVE CANDIDATE ROSTER
          </h2>
          <p className="text-text-muted mt-space-1 font-body text-xs uppercase tracking-wider">
            Select a candidate profile to initiate or review AI interview feedback.
          </p>
        </div>
        <div className="text-[10px] font-mono font-bold text-text-muted bg-surface-raised border border-hairline px-space-3 py-1 rounded-sm">
          SHOWING <span className="text-accent-focus font-extrabold">{filteredCandidates.length}</span> PROFILES
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <Panel className="flex flex-col items-center justify-center p-space-12 text-center">
          <p className="text-text-muted text-sm font-semibold uppercase tracking-wider font-body">
            No candidates match your current filter matrix.
          </p>
          <button
            onClick={() => useCandidatesStore.getState().resetFilters()}
            className="mt-space-4 text-[10px] font-mono font-bold text-accent-focus hover:text-text-primary bg-accent-focus/10 hover:bg-accent-focus/20 border border-accent-focus/20 px-space-4 py-space-2 rounded-sm transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </Panel>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-6"
        >
          {filteredCandidates.map((candidate: Candidate) => {
            // Map pass/pending/failed statuses to StatusChip types
            let statusType: "confirm" | "resolve" | "focus" = "resolve";
            let statusLabel = "PENDING";
            if (candidate.status === "passed") {
              statusType = "confirm";
              statusLabel = "PASSED";
            } else if (candidate.status === "failed") {
              statusType = "focus";
              statusLabel = "GAP TARGET";
            } else if (candidate.status === "scheduled") {
              statusType = "resolve";
              statusLabel = "SCHEDULED";
            }

            return (
              <div
                key={candidate.id}
                className="candidate-card cursor-pointer opacity-0 h-full"
                onClick={() => handleStartInterview(candidate.id)}
              >
                <Panel className="h-full flex flex-col justify-between p-space-6 border border-hairline hover:border-accent-focus/60 transition-colors duration-300 relative overflow-hidden">
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-space-4">
                      <div className="flex items-center gap-space-3">
                        {candidate.avatar ? (
                          <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-sm object-cover border border-hairline"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-sm bg-surface-raised border border-hairline flex items-center justify-center font-bold text-xs text-accent-focus">
                            {getInitials(candidate.name)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-text-primary text-sm tracking-wide font-body">
                            {candidate.name}
                          </h3>
                          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
                            {candidate.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-body text-text-muted uppercase tracking-wider font-semibold">
                          PROGRESS
                        </span>
                        <span className="text-xs font-mono font-bold text-text-primary">
                          {candidate.cohortProgress}%
                        </span>
                      </div>
                    </div>

                    {/* Completion bar in accent-focus */}
                    <div className="w-full bg-surface h-[2px] rounded-none overflow-hidden mt-space-3">
                      <div
                        className="bg-accent-focus h-full transition-all duration-500"
                        style={{ width: `${candidate.cohortProgress}%` }}
                      />
                    </div>

                    {/* Metadata & Status */}
                    <div className="mt-space-6 space-y-space-3">
                      <div className="flex items-center gap-space-2 justify-between">
                        <span className="text-[9px] font-body text-text-muted uppercase tracking-wider font-semibold">
                          EVAL STATUS
                        </span>
                        <StatusChip status={statusType} label={statusLabel} />
                      </div>

                      {candidate.learningSignals.strengths?.length > 0 && (
                        <div className="flex items-center justify-between gap-space-2 pt-space-2 border-t border-hairline">
                          <span className="text-[9px] font-body text-text-muted uppercase tracking-wider font-semibold">
                            PRIMARY FOCUS
                          </span>
                          <span className="text-[10px] font-body text-text-primary font-medium truncate max-w-[150px]">
                            {candidate.learningSignals.strengths[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Score & Start Interview button */}
                  <div className="mt-space-8 pt-space-4 border-t border-hairline flex items-end justify-between">
                    <DataReadout
                      label="MATCH SCORE"
                      value={candidate.score || 0}
                      unit="%"
                    />
                    <div className="flex items-center gap-space-1 text-[10px] font-mono font-bold text-text-muted hover:text-accent-focus transition-colors duration-300">
                      <span className="uppercase tracking-wider">EVALUATE</span>
                      <ArrowRight className="w-3.5 h-3.5 text-accent-focus" />
                    </div>
                  </div>
                </Panel>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
