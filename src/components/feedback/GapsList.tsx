"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import GlassPanel from "../shared/GlassPanel";

interface GapsListProps {
    gaps: string[];
}

export default function GapsList({ gaps }: GapsListProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 },
    };

    return (
        <GlassPanel className="p-5 flex-1 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] bg-black/10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Constructive Growth Areas
            </h3>

            {gaps.length === 0 ? (
                <span className="text-xs text-slate-500 font-medium">None evaluated.</span>
            ) : (
                <motion.ul
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                >
                    {gaps.map((gap, idx) => (
                        <motion.li
                            key={idx}
                            variants={item}
                            className="flex items-start gap-3 text-sm text-slate-350 font-medium leading-relaxed"
                        >
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{gap}</span>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </GlassPanel>
    );
}
