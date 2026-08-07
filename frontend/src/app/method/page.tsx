"use client";

import React, { useEffect, useRef } from "react";
import Panel from "../../components/shared/ui/Panel";
import StatusChip from "../../components/shared/ui/StatusChip";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Settings, MessageSquare, ShieldCheck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MethodPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(".method-card");
    if (!cards || cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 20, filter: "blur(2px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-text-primary px-space-4 py-space-8 md:py-space-16 md:px-space-8 max-w-4xl mx-auto overflow-y-auto relative z-10 flex flex-col gap-space-8 pb-20 select-text"
    >
      {/* Title */}
      <div className="border-b border-hairline pb-space-6 text-center md:text-left">
        <StatusChip status="confirm" label="Methodology" />
        <h1 className="text-3xl md:text-5xl font-display text-text-primary mt-space-3.5 tracking-wide leading-none select-none">
          EVALUATION PROTOCOL
        </h1>
        <p className="text-xs text-text-muted font-body font-semibold mt-1 select-none uppercase tracking-wider">
          Under the hood of the curriculum sequencing and scoring engine.
        </p>
      </div>

      {/* 3 Stages */}
      <div className="space-y-space-6">
        <div className="method-card">
          <Panel className="p-space-6 flex flex-col md:flex-row gap-space-6 items-start relative overflow-hidden">
            <div className="p-space-3 bg-accent-focus/10 border border-accent-focus/25 text-accent-focus rounded-sm">
              <Settings className="w-6 h-6" />
            </div>
            <div className="space-y-space-2 flex-1">
              <span className="text-[10px] font-bold text-accent-focus font-mono uppercase tracking-widest block">
                Stage 01
              </span>
              <h2 className="text-lg font-body font-semibold text-text-primary uppercase tracking-wide">
                Candidate Configuration
              </h2>
              <p className="text-sm text-text-muted font-body leading-relaxed">
                Before commencing the dialogue loop, evaluator matrices are created. The candidate profile details their verified background experience levels, completing target requirements, and skipping known modules to construct a custom competency baseline.
              </p>
              <div className="pt-space-2 border-t border-hairline font-mono text-xs text-accent-focus flex flex-col gap-1">
                <span>METRIC_SOURCE: candidates.json</span>
                <span>SIGNALS_LOADED: [name, role, experience, completedMissions, skippedTopicsCount]</span>
              </div>
            </div>
          </Panel>
        </div>

        <div className="method-card">
          <Panel className="p-space-6 flex flex-col md:flex-row gap-space-6 items-start relative overflow-hidden">
            <div className="p-space-3 bg-accent-resolve/10 border border-accent-resolve/25 text-accent-resolve rounded-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-space-2 flex-1">
              <span className="text-[10px] font-bold text-accent-resolve font-mono uppercase tracking-widest block">
                Stage 02
              </span>
              <h2 className="text-lg font-body font-semibold text-text-primary uppercase tracking-wide">
                Interactive Dialogue Sequencing
              </h2>
              <p className="text-sm text-text-muted font-body leading-relaxed">
                A real-time Chat loop triggers. The agent poses curriculum-linked questions while analyzing the candidate's answers. Keywords from response texts are parsed against curriculum modules dynamically to log curriculum coverage percentages.
              </p>
              <div className="pt-space-2 border-t border-hairline font-mono text-xs text-accent-resolve flex flex-col gap-1">
                <span>EVALUATOR_ENGINE: useInterviewSession + regex parser</span>
                <span>REAL_TIME_SIGNALS: [coveredDays, coveredModules, questionCount, responseLatency]</span>
              </div>
            </div>
          </Panel>
        </div>

        <div className="method-card">
          <Panel className="p-space-6 flex flex-col md:flex-row gap-space-6 items-start relative overflow-hidden">
            <div className="p-space-3 bg-accent-confirm/10 border border-accent-confirm/25 text-accent-confirm rounded-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-space-2 flex-1">
              <span className="text-[10px] font-bold text-accent-confirm font-mono uppercase tracking-widest block">
                Stage 03
              </span>
              <h2 className="text-lg font-body font-semibold text-text-primary uppercase tracking-wide">
                Diagnostic Feedback Report
              </h2>
              <p className="text-sm text-text-muted font-body leading-relaxed">
                Upon completing at least 8 questions across at least 4 curriculum topics, the session diagnostic saves. The scoring module calculates the overall verdict, highlights top candidate strengths, details constructive gaps, and draws a competency radar diagram.
              </p>
              <div className="pt-space-2 border-t border-hairline font-mono text-xs text-accent-confirm flex flex-col gap-1">
                <span>SCORING_MODULE: computeOverallScore + computeModuleRadar</span>
                <span>DIAGNOSTIC_VERDICT: [summary, strengths, gaps, recommendedNextSteps]</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
