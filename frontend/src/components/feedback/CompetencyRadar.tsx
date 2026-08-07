"use client";

import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import Panel from "../shared/ui/Panel";
import { motion } from "framer-motion";

interface CompetencyRadarProps {
  data: { module: string; score: number }[];
}

export default function CompetencyRadar({ data }: CompetencyRadarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="w-full h-full flex flex-col"
    >
      <Panel className="p-space-5 flex flex-col h-full select-none">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-space-4 font-body">
          Competency Radar Matrix
        </h3>
        <div className="w-full h-72 md:h-80 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              {/* Hairline-color grid lines (rgba(236,238,240,0.08)) */}
              <PolarGrid stroke="rgba(236,238,240,0.08)" />

              {/* Axis labels in Barlow */}
              <PolarAngleAxis
                dataKey="module"
                tick={{
                  fill: "#8B929B",
                  fontSize: 9,
                  fontWeight: 500,
                  fontFamily: "var(--font-body)",
                }}
              />

              {/* Numeric ticks in DM Mono */}
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{
                  fill: "#8B929B",
                  fontSize: 8,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                }}
                axisLine={false}
              />

              {/* Radar area colored in accent-focus (#4FD3DE) */}
              <Radar
                name="Score"
                dataKey="score"
                stroke="#4FD3DE"
                fill="#4FD3DE"
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </motion.div>
  );
}
