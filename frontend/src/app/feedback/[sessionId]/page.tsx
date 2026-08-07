"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFeedbackStore } from "../../../hooks/useFeedbackStore";
import { scoring } from "../../../lib/scoring";
import Panel from "../../../components/shared/ui/Panel";
import StatusChip from "../../../components/shared/ui/StatusChip";
import ScoreGauge from "../../../components/feedback/ScoreGauge";
import SummaryPanel from "../../../components/feedback/SummaryPanel";
import StrengthsList from "../../../components/feedback/StrengthsList";
import GapsList from "../../../components/feedback/GapsList";
import Recommendations from "../../../components/feedback/Recommendations";
import ActionBar from "../../../components/feedback/ActionBar";
import dynamic from "next/dynamic";

const CompetencyRadar = dynamic(() => import("../../../components/feedback/CompetencyRadar"), {
  ssr: false,
  loading: () => <div className="h-80 bg-surface/5 border border-hairline animate-pulse rounded-sm" />
});
import { motion } from "framer-motion";
import { LayoutGrid, AlertCircle } from "lucide-react";
import { api } from "../../../lib/api";
import { Candidate } from "../../../lib/types";

export default function FeedbackPage() {
    const router = useRouter();
    const params = useParams();

    const sessionId = typeof params.sessionId === "string" ? params.sessionId : "";

    const [session, setSession] = useState<any>(null);
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            return;
        }

        let currentSession = useFeedbackStore.getState().getFeedbackSession(sessionId);

        if (!currentSession) {
            try {
                const cached = sessionStorage.getItem(`feedback-${sessionId}`);
                if (cached) {
                    currentSession = JSON.parse(cached);
                }
            } catch (err) {
                console.error("Failed to read sessionStorage feedback", err);
            }
        } else {
            try {
                sessionStorage.setItem(`feedback-${sessionId}`, JSON.stringify(currentSession));
            } catch (e) { }
        }

        if (currentSession) {
            setSession(currentSession);

            const candId = currentSession.candidateId || "cand-1";
            api.getCandidateById(candId).then((c) => {
                if (c) setCandidate(c);
            });
        }

        setLoading(false);
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white select-none">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                        Loading report...
                    </span>
                </div>
            </div>
        );
    }

    if (!session || !session.feedback) {
        return (
            <div className="min-h-screen flex items-center justify-center px-space-4 select-none relative z-10">
                <Panel className="p-space-8 max-w-md w-full text-center flex flex-col items-center gap-space-6">
                    <div className="w-12 h-12 rounded-full bg-accent-focus/10 flex items-center justify-center border border-accent-focus/25">
                        <AlertCircle className="w-6 h-6 text-accent-focus" />
                    </div>
                    <div>
                        <h2 className="text-lg font-body font-semibold text-text-primary leading-snug">
                            No Feedback Session Found
                        </h2>
                        <p className="text-xs text-text-muted font-body leading-relaxed mt-space-2">
                            It looks like this session has expired or you accessed the page directly. Return to the main candidates portal to launch an interview.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-space-3 rounded-sm bg-accent-focus text-[#0B0D10] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-space-2 cursor-pointer transition-all hover:opacity-90"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Back to dashboard
                    </button>
                </Panel>
            </div>
        );
    }

    const { feedback, candidateId, modulesCovered, questionCount, daysCoveredCount, totalQuestions, totalDaysCovered } = session;

    const calculatedScore = scoring.computeOverallScore(feedback, {
        questionsAsked: questionCount || totalQuestions || 8,
        daysCovered: daysCoveredCount || totalDaysCovered || 4,
        modulesCovered: modulesCovered || ["React Hooks & Rendering", "State Management", "Next.js Routing & RSCs"],
    });

    const radarData = scoring.computeModuleRadar(feedback, modulesCovered || [
        "React Hooks & Rendering",
        "State Management",
        "Next.js Routing & RSCs",
    ]);

    const fullReportData = {
        sessionId,
        candidate: candidate ? { id: candidate.id, name: candidate.name, role: candidate.role } : null,
        score: calculatedScore,
        radar: radarData,
        feedback,
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen text-text-primary px-space-4 py-space-8 md:py-space-16 md:px-space-8 max-w-6xl mx-auto overflow-y-auto custom-scrollbar relative z-10 flex flex-col gap-space-8 pb-20 select-text">
            <div className="text-center md:text-left border-b border-hairline pb-space-6">
                <StatusChip status="confirm" label="Session Diagnostic Complete" />
                <h1 className="text-3xl md:text-5xl font-display text-text-primary mt-space-3.5 tracking-wide leading-tight select-none">
                    TECHNICAL EVALUATION SUMMARY
                </h1>
                <p className="text-xs text-text-muted font-body font-semibold mt-1 select-none uppercase tracking-wider">
                    {candidate ? `Candidate: ${candidate.name} — ${candidate.role}` : `Session ID: ${sessionId}`}
                </p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-6"
            >
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    <div className="flex items-center justify-center">
                        <ScoreGauge score={calculatedScore} />
                    </div>

                    <div className="md:col-span-2">
                        <CompetencyRadar data={radarData} />
                    </div>
                </motion.div>

                <motion.div variants={item}>
                    <SummaryPanel summary={feedback.summary} />
                </motion.div>

                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <StrengthsList strengths={feedback.strengths} />
                    <GapsList gaps={feedback.gaps} />
                </motion.div>

                <motion.div variants={item}>
                    <Recommendations recommendations={feedback.next} />
                </motion.div>

                <motion.div variants={item}>
                    <ActionBar
                        candidateId={candidate?.id || candidateId || "cand-1"}
                        feedbackData={fullReportData}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
