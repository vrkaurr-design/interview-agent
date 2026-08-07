"use client";

import React from "react";
import { motion } from "framer-motion";
import Panel from "../shared/ui/Panel";
import StatusChip from "../shared/ui/StatusChip";

interface StrengthsListProps {
  strengths: string[];
}

export default function StrengthsList({ strengths }: StrengthsListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -8 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <Panel className="p-space-5 flex-1 flex flex-col">
      <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-space-4 font-body">
        Primary Strengths
      </h3>

      {strengths.length === 0 ? (
        <span className="text-xs text-text-muted font-body font-semibold">None evaluated.</span>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="divide-y divide-hairline flex-1 flex flex-col justify-start"
        >
          {strengths.map((str, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="flex items-center gap-space-3 py-space-3 first:pt-0 last:pb-0 text-sm text-text-primary font-body font-semibold"
            >
              <StatusChip status="confirm" label="STRENGTH" />
              <span>{str}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Panel>
  );
}
