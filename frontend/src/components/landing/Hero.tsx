"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import ApertureField from "../shared/ApertureField";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const scrollProgressRef = useRef({ value: 0 });

  useEffect(() => {
    // 1. Entrance animation on mount
    const tl = gsap.timeline();
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 15, filter: "blur(2px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.4"
      );

    // 2. ScrollTrigger to scrub Aperture openness directly inside scrollProgressRef
    let trigger: ScrollTrigger | null = null;
    if (typeof window !== "undefined") {
      trigger = ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "+=600",
        scrub: true,
        onUpdate: (self) => {
          scrollProgressRef.current.value = self.progress;
        },
      });
    }

    return () => {
      if (trigger) {
        trigger.kill();
      }
    };
  }, []);

  const handleScrollToGrid = () => {
    const gridSection = document.getElementById("candidate-grid-section");
    if (gridSection) {
      gridSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col justify-center min-h-[85vh] text-left overflow-hidden px-space-8 md:px-space-16 lg:px-space-20 py-space-16"
    >
      {/* 3D Background Aperture Component */}
      <ApertureField openness={0} intensity="hero" scrollProgressRef={scrollProgressRef} />

      <div className="max-w-3xl space-y-space-4 z-10">
        <div className="inline-flex items-center gap-space-2 px-space-2 py-[2px] text-[10px] font-semibold tracking-wider uppercase border border-accent-focus/20 bg-accent-focus/5 text-accent-focus font-mono rounded-sm">
          SYS::ACTIVE_MONITORING
        </div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-8xl font-display tracking-wide text-text-primary leading-none select-none"
        >
          EVERY CANDIDATE,<br />
          BROUGHT INTO FOCUS.
        </h1>

        <p
          ref={subRef}
          className="text-sm md:text-base text-text-muted font-body leading-relaxed max-w-xl"
        >
          Evaluate cognitive learning loops, trace curriculum progression milestones, and run interactive AI interview sessions in real-time.
        </p>

        <div className="pt-space-4">
          <button
            ref={ctaRef}
            onClick={handleScrollToGrid}
            className="group relative inline-flex items-center gap-space-2 px-space-5 py-space-3 bg-surface-raised border border-hairline hover:border-accent-focus text-text-primary font-mono text-xs uppercase tracking-wider rounded-sm transition-all duration-300"
          >
            <span>Start Candidate Evaluation</span>
            <ArrowDown className="w-4 h-4 text-accent-focus transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
