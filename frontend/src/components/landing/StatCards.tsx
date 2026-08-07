"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DataReadout from "../shared/ui/DataReadout";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StatCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [candidatesCount, setCandidatesCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    const obj = { cand: 0, passed: 0, pending: 0, score: 0 };

    let trigger: ScrollTrigger | null = null;
    if (containerRef.current) {
      trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 88%",
        onEnter: () => {
          gsap.to(obj, {
            cand: 8,
            passed: 3,
            pending: 5,
            score: 85,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              setCandidatesCount(Math.floor(obj.cand));
              setPassedCount(Math.floor(obj.passed));
              setPendingCount(Math.floor(obj.pending));
              setAvgScore(Math.floor(obj.score));
            },
          });
        },
      });
    }

    return () => {
      if (trigger) {
        trigger.kill();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="max-w-6xl mx-auto px-space-6 py-space-6 border-y border-hairline mt-space-6 mb-space-8"
    >
      {/* 2x2 Grid on Mobile, 1x4 Row on Desktop. Columns separated by hairlines */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-space-6 md:gap-y-0 divide-y-0 divide-x-0 md:divide-x divide-hairline">
        <div className="flex justify-start md:px-space-6 py-space-2 md:py-0 pl-space-2">
          <DataReadout label="Total Candidates" value={candidatesCount} />
        </div>

        <div className="flex justify-start md:px-space-6 py-space-2 md:py-0 pl-space-6 md:pl-space-6">
          <DataReadout label="Passed Matrix" value={passedCount} />
        </div>

        <div className="flex justify-start md:px-space-6 py-space-2 md:py-0 border-t border-hairline md:border-t-0 pl-space-2 md:pl-space-6">
          <DataReadout label="Pending Review" value={pendingCount} />
        </div>

        <div className="flex justify-start md:px-space-6 py-space-2 md:py-0 border-t border-hairline md:border-t-0 pl-space-6 md:pl-space-6">
          <DataReadout label="Average Score" value={avgScore} unit="%" />
        </div>
      </div>
    </div>
  );
}
