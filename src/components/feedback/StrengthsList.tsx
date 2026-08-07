"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import GlassPanel from "../shared/GlassPanel";

interface StrengthsListProps {
    strengths: string[];
}

export default function StrengthsList({ strengths }: StrengthsListProps) {
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
        <GlassPanel className="p-5 flex-1 hover:shadow-[0_0_30px_rgba(62,217,200,0.1)] bg-black/10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Primary Strengths
            </h3>

            {strengths.length === 0 ? (
                <span className="text-xs text-slate-500 font-medium">None evaluated.</span>
            ) : (
                <motion.ul
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                >
                    {strengths.map((str, idx) => (
                        <motion.li
                            key={idx}
                            variants={item}
                            className="flex items-start gap-3 text-sm text-slate-350 font-medium leading-relaxed"
                        >
                            <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                            <span>{str}</span>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </GlassPanel>
    );
}
