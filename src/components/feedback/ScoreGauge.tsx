"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import GlassPanel from "../shared/GlassPanel";
import { cn } from "../../lib/utils";

interface ScoreGaugeProps {
    score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
    const count = useMotionValue(0);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(count, score, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(Math.round(latest)),
        });
        return () => controls.stop();
    }, [score, count]);

    const getColors = (val: number) => {
        if (val < 50) {
            return {
                hover: "hover:shadow-[0_0_30px_rgba(235,94,85,0.2)]",
                stroke: "stroke-caution",
                text: "text-caution",
                label: "Needs Focus",
            };
        }
        if (val <= 74) {
            return {
                hover: "hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
                stroke: "stroke-amber-400",
                text: "text-amber-400",
                label: "Competent",
            };
        }
        return {
            hover: "hover:shadow-[0_0_30px_rgba(62,217,200,0.2)]",
            stroke: "stroke-secondary",
            text: "text-secondary",
            label: "Excelled",
        };
    };

    const colors = getColors(score);
    const size = 160;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (displayValue / 100) * circumference;

    return (
        <GlassPanel className={cn(
            "flex flex-col items-center justify-center p-6 text-white text-center relative select-none w-full max-w-[280px] mx-auto bg-black/10",
            colors.hover
        )}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                Overall Score Verdict
            </span>

            <div className="relative w-40 h-40 flex items-center justify-center">
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
                        className={cn("fill-transparent transition-colors duration-300", colors.stroke)}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                    <span className={cn("text-4.5xl font-black tracking-tighter tabular-nums", colors.text)}>
                        {displayValue}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">
                        out of 100
                    </span>
                </div>
            </div>

            <span className={cn("text-[10px] font-black uppercase tracking-widest mt-4 px-3 py-1.5 bg-white/5 rounded-full border border-white/5", colors.text)}>
                {colors.label}
            </span>
        </GlassPanel>
    );
}
