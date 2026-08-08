"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Sparkles, X } from "lucide-react";
import ApertureField from "../shared/ApertureField";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaAreaRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef({ value: 0 });

  const [isOpen, setIsOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState("");

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
        ctaAreaRef.current,
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

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customRole) return;

    // Format inputs for clean custom ID structure
    const formattedName = encodeURIComponent(customName.trim().replace(/\s+/g, "-"));
    const formattedRole = encodeURIComponent(customRole.trim().replace(/\s+/g, "-"));
    const candidateId = `custom_${formattedName}_${formattedRole}`;

    const sessionId =
      typeof window !== "undefined" && window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    router.push(`/interview/${candidateId}?sessionId=${sessionId}`);
    setIsOpen(false);
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

        <div ref={ctaAreaRef} className="pt-space-4 flex flex-wrap gap-space-4">
          <button
            onClick={handleScrollToGrid}
            className="group relative inline-flex items-center gap-space-2 px-space-5 py-space-3 bg-surface-raised border border-hairline hover:border-accent-focus text-text-primary font-mono text-xs uppercase tracking-wider rounded-sm transition-all duration-300 cursor-pointer"
          >
            <span>Active Candidate Roster</span>
            <ArrowDown className="w-4 h-4 text-accent-focus transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="group inline-flex items-center gap-space-2 px-space-5 py-space-3 bg-accent-focus/10 border border-accent-focus/25 hover:bg-accent-focus/20 hover:border-accent-focus text-accent-focus hover:text-text-primary font-mono text-xs uppercase tracking-wider rounded-sm transition-all duration-300 cursor-pointer"
          >
            <span>Interview Any Topic</span>
            <Sparkles className="w-4 h-4 text-accent-focus" />
          </button>
        </div>
      </div>

      {/* Dynamic Custom Candidate Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-space-4">
          <div className="w-full max-w-md bg-surface-raised border border-hairline p-space-6 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-display text-text-primary tracking-wide mb-space-1 uppercase">
              Custom Candidate Interview
            </h3>
            <p className="text-[10px] text-text-muted font-body uppercase tracking-wider mb-space-6">
              Specify a candidate name and any topic or role to evaluate.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-space-4">
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-space-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ada Lovelace"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-surface border border-hairline py-space-2 px-space-3 text-sm text-text-primary placeholder-text-muted/30 focus:outline-none focus:border-accent-focus transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-space-1">
                  Job Role / Technical Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python Backend Developer"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full bg-surface border border-hairline py-space-2 px-space-3 text-sm text-text-primary placeholder-text-muted/30 focus:outline-none focus:border-accent-focus transition-all"
                />
              </div>

              <div className="pt-space-2 flex justify-end gap-space-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-space-4 py-space-2 border border-hairline text-text-muted hover:text-text-primary font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-5 py-space-2 bg-accent-focus hover:bg-accent-focus/25 text-text-primary border border-accent-focus font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Start Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
