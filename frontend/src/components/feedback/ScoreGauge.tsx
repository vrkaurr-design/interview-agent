"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Panel from "../shared/ui/Panel";
import ApertureField from "../shared/ApertureField";

interface ScoreGaugeProps {
  score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.5,
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [score, count]);

  const getLabel = (val: number) => {
    if (val < 50) return "Needs Focus";
    if (val <= 74) return "Competent";
    return "Excelled";
  };

  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  return (
    <Panel className="flex flex-col items-center justify-center p-space-6 text-text-primary text-center relative select-none w-full max-w-[280px] mx-auto overflow-hidden">
      {/* 3D Aperture centered behind the gauge */}
      <ApertureField openness={displayValue / 100} intensity="gauge" />

      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-space-4 font-body z-10">
        Overall Score Verdict
      </span>

      <div className="relative w-40 h-40 flex items-center justify-center z-10">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-white/5 fill-transparent"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-accent-focus fill-transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-6xl font-display text-accent-focus leading-none select-all">
            {displayValue}
          </span>
          <span className="text-[8px] text-text-muted uppercase tracking-wider font-mono font-bold mt-space-1">
            out of 100
          </span>
        </div>
      </div>

      <span className="text-[10px] font-bold text-accent-focus uppercase tracking-widest mt-space-4 px-space-3 py-space-1 bg-accent-focus/10 rounded-sm border border-accent-focus/25 z-10 font-mono">
        {getLabel(displayValue)}
      </span>
    </Panel>
  );
}
