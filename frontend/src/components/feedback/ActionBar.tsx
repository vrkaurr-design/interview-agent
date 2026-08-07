"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Download, LayoutGrid } from "lucide-react";
import { cn } from "../../lib/utils";

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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-space-3.5 w-full select-none mt-space-6">
      {/* Primary Filled Button: Save report */}
      <button
        onClick={handleDownload}
        className="w-full sm:w-auto px-space-6 py-space-3 bg-accent-focus text-[#0B0D10] font-mono text-xs font-bold tracking-wider rounded-sm hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-space-2 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Save report</span>
      </button>

      {/* Secondary Hairline Button: Schedule follow-up */}
      <button
        onClick={handleRetry}
        className="w-full sm:w-auto px-space-6 py-space-3 bg-surface-raised text-text-primary border border-hairline hover:border-accent-focus/40 font-mono text-xs font-bold tracking-wider rounded-sm transition-all flex items-center justify-center gap-space-2 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 text-accent-focus" />
        <span>Schedule follow-up</span>
      </button>

      {/* Secondary Hairline Button: Back to dashboard */}
      <button
        onClick={() => router.push("/")}
        className="w-full sm:w-auto px-space-6 py-space-3 bg-surface-raised text-text-primary border border-hairline hover:border-accent-focus/40 font-mono text-xs font-bold tracking-wider rounded-sm transition-all flex items-center justify-center gap-space-2 cursor-pointer"
      >
        <LayoutGrid className="w-4 h-4 text-accent-focus" />
        <span>Back to dashboard</span>
      </button>
    </div>
  );
}
