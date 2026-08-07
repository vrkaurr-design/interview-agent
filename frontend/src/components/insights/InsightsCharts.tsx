"use client";

import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Panel from "../shared/ui/Panel";

interface InsightsChartsProps {
  trendData: any[];
  gapData: any[];
}

export default function InsightsCharts({ trendData, gapData }: InsightsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-6 items-stretch w-full">
      {/* Trend chart */}
      <Panel className="p-space-5 flex flex-col min-h-[340px]">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-space-4 font-body">
          Match score trends over time
        </h3>
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid stroke="rgba(236,238,240,0.08)" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#8B929B", fontSize: 9, fontFamily: "var(--font-body)" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#8B929B", fontSize: 8, fontFamily: "var(--font-mono)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#14171C",
                  borderColor: "rgba(236,238,240,0.08)",
                  borderRadius: "2px",
                }}
                itemStyle={{ color: "#eceef0", fontSize: "11px", fontFamily: "var(--font-body)" }}
                labelStyle={{ color: "#8b929b", fontSize: "9px", fontFamily: "var(--font-mono)" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4FD3DE"
                strokeWidth={2}
                dot={{ fill: "#4FD3DE", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Gaps chart */}
      <Panel className="p-space-5 flex flex-col min-h-[340px]">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-space-4 font-body">
          Most frequent constructive gap areas
        </h3>
        {gapData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-text-muted font-body text-xs font-semibold">
            No gap trends cataloged yet.
          </div>
        ) : (
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapData}>
                <CartesianGrid stroke="rgba(236,238,240,0.08)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="topic"
                  tick={{ fill: "#8B929B", fontSize: 9, fontFamily: "var(--font-body)" }}
                />
                <YAxis
                  tick={{ fill: "#8B929B", fontSize: 8, fontFamily: "var(--font-mono)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#14171C",
                    borderColor: "rgba(236,238,240,0.08)",
                    borderRadius: "2px",
                  }}
                  itemStyle={{ color: "#eceef0", fontSize: "11px", fontFamily: "var(--font-body)" }}
                  labelStyle={{ color: "#8b929b", fontSize: "9px", fontFamily: "var(--font-mono)" }}
                />
                <Bar dataKey="count" fill="#E8A33D" radius={[2, 2, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Panel>
    </div>
  );
}
