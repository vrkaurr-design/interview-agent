"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFeedbackStore } from "../../../hooks/useFeedbackStore";
import { scoring } from "../../../lib/scoring";
import GlassPanel from "../../../components/shared/GlassPanel";
import ScoreGauge from "../../../components/feedback/ScoreGauge";
import CompetencyRadar from "../../../components/feedback/CompetencyRadar";
import SummaryPanel from "../../../components/feedback/SummaryPanel";
import StrengthsList from "../../../components/feedback/StrengthsList";
import GapsList from "../../../components/feedback/GapsList";
import Recommendations from "../../../components/feedback/Recommendations";
import ActionBar from "../../../components/feedback/ActionBar";
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
            <div className="min-h-screen flex items-center justify-center px-4 select-none bg-black/60 relative z-10">
                <GlassPanel className="p-8 max-w-md w-full border border-white/10 text-center flex flex-col items-center gap-6 bg-black/5">
                    <div className="w-12 h-12 rounded-full bg-caution/10 flex items-center justify-center border border-caution/20">
                        <AlertCircle className="w-6 h-6 text-caution" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white leading-snug">
                            No Feedback Session Found
                        </h2>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">
                            It looks like this session has expired or you accessed the page directly. Return to the main candidates portal to launch an interview.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-3 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 active:scale-98 transition-all"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Back to Candidates
                    </button>
                </GlassPanel>
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
        <div className="min-h-screen text-white px-4 py-8 md:py-16 md:px-8 max-w-6xl mx-auto overflow-y-auto custom-scrollbar relative z-10 flex flex-col gap-8 pb-20 select-text">
            <div className="text-center md:text-left border-b border-white/5 pb-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full select-none">
                    Session Diagnostic Complete
                </span>
                <h1 className="text-2.5xl md:text-4xl font-black text-white mt-3.5 tracking-tight leading-tight select-none">
                    Technical Evaluation Summary
                </h1>
                <p className="text-xs text-slate-400 font-semibold mt-1 select-none">
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
