"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Download, LayoutGrid } from "lucide-react";

interface ActionBarProps {
    candidateId: string;
    feedbackData: any;
}

export default function ActionBar({ candidateId, feedbackData }: ActionBarProps) {
    const router = useRouter();

    const handleRetry = () => {
        router.push(`/interview/${candidateId}?sessionId=sess-${Date.now()}`);
    };

    const handleDownload = () => {
        const rawJSON = JSON.stringify(feedbackData, null, 2);
        const blob = new Blob([rawJSON], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `interview-session-${feedbackData.sessionId || "feedback"}.json`;
        anchor.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full select-none mt-6">
            <button
                onClick={handleRetry}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 active:scale-98 transition-all"
            >
                <RotateCcw className="w-4.5 h-4.5" />
                Retry Interview
            </button>

            <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer border border-white/5 hover:border-white/15 transition-all"
            >
                <Download className="w-4.5 h-4.5" />
                Download Report
            </button>

            <button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto px-5 py-3 rounded-xl hover:text-white text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-white/5"
            >
                <LayoutGrid className="w-4.5 h-4.5" />
                Candidates List
            </button>
        </div>
    );
}
