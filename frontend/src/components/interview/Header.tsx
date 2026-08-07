"use client";

import React, { useEffect, useState } from "react";
import { Timer, Power, Menu, BarChart2 } from "lucide-react";
import { Candidate } from "../../lib/types";

interface HeaderProps {
  candidate: Candidate;
  isLoading: boolean;
  onEndInterview: () => void;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  done: boolean;
}

export default function Header({
  candidate,
  isLoading,
  onEndInterview,
  onToggleLeft,
  onToggleRight,
  done,
}: HeaderProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [done]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
    <header className="w-full bg-surface/90 border-b border-hairline backdrop-blur-md sticky top-0 z-50 px-space-4 py-space-3 flex items-center justify-between">
      <div className="flex items-center gap-space-3">
        {/* Toggle Left Sidebar Mobile Button */}
        <button
          onClick={onToggleLeft}
          className="md:hidden p-space-2.5 hover:bg-surface-raised border border-hairline rounded-sm text-text-muted hover:text-text-primary transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Toggle Profile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-space-2.5">
          {candidate.avatar ? (
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-9 h-9 rounded-sm object-cover border border-hairline"
            />
          ) : (
            <div className="w-9 h-9 rounded-sm bg-accent-focus/15 border border-accent-focus/25 flex items-center justify-center font-bold text-xs text-accent-focus">
              {getInitials(candidate.name)}
            </div>
          )}
          <div>
            <h1 className="font-semibold text-text-primary text-sm leading-tight select-none font-body tracking-wide">
              {candidate.name}
            </h1>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
              {candidate.role}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-space-4 md:gap-space-6">
        {/* Timer readout */}
        <div className="flex items-center gap-space-2 text-text-primary text-xs font-semibold tracking-wide bg-surface-raised border border-hairline px-space-2.5 py-space-1.5 rounded-sm select-none">
          <Timer className="w-4 h-4 text-accent-resolve" />
          <span className="tabular-nums font-mono">{formatTime(seconds)}</span>
        </div>

        {/* AI thinking state */}
        <div className="flex items-center gap-space-2 text-xs font-semibold select-none">
          <span
            className={`w-2 h-2 rounded-full ${
              isLoading ? "bg-accent-resolve animate-pulse" : "bg-accent-confirm"
            } transition-all duration-300`}
          />
          <span className="hidden sm:inline text-text-muted text-[9px] uppercase tracking-wider font-mono font-bold">
            {isLoading ? "AI Thinking" : "Connected"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-2">
        {/* End interview trigger */}
        <button
          onClick={onEndInterview}
          className="text-xs font-mono font-bold text-accent-focus hover:text-text-primary bg-accent-focus/10 border border-accent-focus/20 hover:bg-accent-focus/20 px-space-3.5 py-space-2 rounded-sm transition-all cursor-pointer min-w-[44px] min-h-[44px]"
        >
          <span className="flex items-center gap-space-1.5">
            <Power className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Session</span>
          </span>
        </button>

        {/* Toggle Right Sidebar Mobile Button */}
        <button
          onClick={onToggleRight}
          className="md:hidden p-space-2.5 hover:bg-surface-raised border border-hairline rounded-sm text-text-muted hover:text-text-primary transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Toggle Coverage Menu"
        >
          <BarChart2 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
