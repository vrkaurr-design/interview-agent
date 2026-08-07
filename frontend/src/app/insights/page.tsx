"use client";

import React, { useMemo } from "react";
import Panel from "../../components/shared/ui/Panel";
import StatusChip from "../../components/shared/ui/StatusChip";
import DataReadout from "../../components/shared/ui/DataReadout";
import { useFeedbackStore } from "../../hooks/useFeedbackStore";
import { scoring } from "../../lib/scoring";
import dynamic from "next/dynamic";

const InsightsCharts = dynamic(() => import("../../components/insights/InsightsCharts"), {
  ssr: false,
  loading: () => <div className="h-[340px] bg-[#14171C]/40 border border-hairline animate-pulse rounded-sm w-full" />
});

export default function InsightsPage() {
  const sessions = useFeedbackStore((state) => state.sessions);

  const parsedSessions = useMemo(() => {
    const list = Object.entries(sessions);

    // Default mock data if no sessions have been run yet in the current browser memory
    if (list.length === 0) {
      return [
        { candidateName: "Sarah Connor", score: 92, date: "08/04", gaps: ["Webpack configs"] },
        { candidateName: "Luke Skywalker", score: 78, date: "08/05", gaps: ["Concurrent Rendering", "Three.js and R3F"] },
        { candidateName: "Ellen Ripley", score: 96, date: "08/06", gaps: ["TypeScript Generics"] },
        { candidateName: "John Connor", score: 42, date: "08/07", gaps: ["Concurrent Rendering", "Three.js and R3F", "Zustand State Engine"] },
        { candidateName: "Marcus Wright", score: 88, date: "08/08", gaps: ["Vitest Mocking", "Webpack configs"] },
      ];
    }

    return list.map(([sessId, sess]: [string, any]) => {
      const calculatedScore = scoring.computeOverallScore(sess.feedback, {
        questionsAsked: sess.questionCount || 8,
        daysCovered: sess.daysCoveredCount || 4,
        modulesCovered: sess.modulesCovered || ["React Hooks & Rendering"],
      });

      // Simple date mapping helper
      let dateLabel = "08/08";
      try {
        const timePart = sessId.split("-")[1];
        if (timePart && !isNaN(Number(timePart))) {
          const dateObj = new Date(Number(timePart));
          dateLabel = `${(dateObj.getMonth() + 1).toString().padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}`;
        }
      } catch (e) {}

      return {
        candidateName: sess.candidateId === "cand-1" ? "Sarah Connor" : sess.candidateId === "cand-2" ? "Luke Skywalker" : sess.candidateId === "cand-3" ? "Ellen Ripley" : "Candidate " + sess.candidateId,
        score: calculatedScore,
        date: dateLabel,
        gaps: sess.feedback.gaps || [],
      };
    });
  }, [sessions]);

  // Aggregate Stats
  const totalCount = parsedSessions.length;
  const avgScore = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round(parsedSessions.reduce((acc, s) => acc + s.score, 0) / totalCount);
  }, [parsedSessions, totalCount]);

  const passRate = useMemo(() => {
    if (totalCount === 0) return 0;
    const passed = parsedSessions.filter((s) => s.score >= 70).length;
    return Math.round((passed / totalCount) * 100);
  }, [parsedSessions, totalCount]);

  // Score Trend Data
  const trendData = useMemo(() => {
    return parsedSessions
      .map((s, idx) => ({
        index: idx + 1,
        date: s.date,
        score: s.score,
        name: s.candidateName,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [parsedSessions]);

  // Gap frequency counting
  const gapData = useMemo(() => {
    const counts: Record<string, number> = {};
    parsedSessions.forEach((s) => {
      s.gaps.forEach((gap: string) => {
        counts[gap] = (counts[gap] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([topic, count]) => ({
        topic,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 gaps
  }, [parsedSessions]);

  return (
    <div className="min-h-screen text-text-primary px-space-6 py-space-8 md:py-space-16 max-w-6xl mx-auto overflow-y-auto relative z-10 flex flex-col gap-space-8 pb-20 select-text">
      {/* Header */}
      <div className="border-b border-hairline pb-space-6">
        <StatusChip status="confirm" label="Telemetry Center" />
        <h1 className="text-3xl md:text-5xl font-display text-text-primary mt-space-3.5 tracking-wide leading-none select-none">
          AGGREGATE COHORT ANALYTICS
        </h1>
        <p className="text-xs text-text-muted font-body font-semibold mt-1 select-none uppercase tracking-wider">
          Diagnostic trends and performance summaries across evaluations.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-space-6 border-b border-hairline pb-space-6">
        <Panel className="p-space-5">
          <DataReadout label="Pass rate (score >= 70)" value={passRate} unit="%" />
        </Panel>
        <Panel className="p-space-5">
          <DataReadout label="Average diagnostic score" value={avgScore} unit="%" />
        </Panel>
        <Panel className="p-space-5 col-span-2 md:col-span-1">
          <DataReadout label="Total completed reports" value={totalCount} />
        </Panel>
      </div>

      {/* Trend & Gaps Charts */}
      <InsightsCharts trendData={trendData} gapData={gapData} />
    </div>
  );
}
