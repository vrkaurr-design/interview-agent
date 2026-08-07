"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCandidatesStore } from "../../hooks/useCandidates";
import GlassPanel from "../shared/GlassPanel";
import { Award, EyeOff, ArrowRight } from "lucide-react";
import { Candidate } from "../../lib/types";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 16, filter: "blur(2px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
};

export default function CandidateGrid() {
    const router = useRouter();
    const getFilteredCandidates = useCandidatesStore((state) => state.getFilteredCandidates);
    const filteredCandidates = getFilteredCandidates();

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

    return (
        <section id="candidate-grid-section" className="max-w-6xl mx-auto px-4 py-12 scroll-mt-24">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Active Candidate Roster</h2>
                    <p className="text-slate-400 mt-1">Select a candidate profile to initiate or review AI interview feedback.</p>
                </div>
                <div className="text-xs font-semibold text-slate-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg tabular-nums">
                    Showing <span className="text-secondary font-bold">{filteredCandidates.length}</span> Profiles
                </div>
            </div>

            {filteredCandidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                    <p className="text-slate-400 text-lg font-medium">No candidates match your current filter matrix.</p>
                    <button
                        onClick={() => useCandidatesStore.getState().resetFilters()}
                        className="mt-4 text-xs font-semibold text-primary hover:text-white bg-primary/10 border border-primary/20 hover:bg-primary/20 px-4.5 py-2.5 rounded-xl transition-all"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredCandidates.map((candidate: Candidate) => (
                        <motion.div
                            key={candidate.id}
                            variants={cardVariants}
                            whileHover={{ y: -6, scale: 1.01 }}
                            className="cursor-pointer group h-full"
                            onClick={() => handleStartInterview(candidate.id)}
                        >
                            <GlassPanel className="h-full flex flex-col justify-between border border-white/10 group-hover:border-primary/40 group-hover:shadow-[0_8px_30px_rgb(109,94,245,0.15)] transition-all duration-300 relative overflow-hidden p-6 rounded-2xl">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-xl pointer-events-none rounded-full group-hover:bg-primary/25 transition-all" />

                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            {candidate.avatar ? (
                                                <img
                                                    src={candidate.avatar}
                                                    alt={candidate.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-white/15"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-sm text-primary">
                                                    {getInitials(candidate.name)}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors">{candidate.name}</h3>
                                                <p className="text-xs text-slate-400 font-medium">{candidate.role}</p>
                                            </div>
                                        </div>

                                        <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle
                                                    cx="22"
                                                    cy="22"
                                                    r="18"
                                                    className="stroke-white/5 fill-transparent"
                                                    strokeWidth="2.5"
                                                />
                                                <circle
                                                    cx="22"
                                                    cy="22"
                                                    r="18"
                                                    className="stroke-secondary fill-transparent transition-all duration-500"
                                                    strokeWidth="2.5"
                                                    strokeDasharray={2 * Math.PI * 18}
                                                    strokeDashoffset={2 * Math.PI * 18 * (1 - candidate.cohortProgress / 100)}
                                                />
                                            </svg>
                                            <span className="absolute text-[10px] font-black text-slate-200 tabular-nums">
                                                {candidate.cohortProgress}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        {candidate.learningSignals.strengths?.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-strength shrink-0" />
                                                <span className="text-xs font-semibold text-slate-300">
                                                    {candidate.learningSignals.strengths[0]}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <EyeOff className="w-4 h-4 text-caution shrink-0" />
                                            <span className="text-xs text-slate-400 font-medium">
                                                {candidate.skippedTopicsCount === 0
                                                    ? "All topics completed"
                                                    : `${candidate.skippedTopicsCount} skipped topics`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-semibold group-hover:text-white transition-colors">
                                    <span className="uppercase tracking-wider">Experience: {candidate.experience}</span>
                                    <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                                        <span>Evaluate</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </section>
    );
}
