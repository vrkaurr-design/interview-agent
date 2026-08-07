"use client";

import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import GlassPanel from "../shared/GlassPanel";
import { motion } from "framer-motion";

interface CompetencyRadarProps {
    data: { module: string; score: number }[];
}

export default function CompetencyRadar({ data }: CompetencyRadarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-full flex-1"
        >
            <GlassPanel className="p-5 flex flex-col h-full hover:shadow-[0_0_30px_rgba(109,94,245,0.15)] select-none bg-black/10">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                    Competency Radar
                </h3>
                <div className="w-full h-72 md:h-80 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis
                                dataKey="module"
                                tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 600 }}
                            />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={{ fill: "#64748b", fontSize: 8 }}
                                axisLine={false}
                            />
                            <Radar
                                name="Score"
                                dataKey="score"
                                stroke="#6D5EF5"
                                fill="#6D5EF5"
                                fillOpacity={0.25}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </GlassPanel>
        </motion.div>
    );
}
