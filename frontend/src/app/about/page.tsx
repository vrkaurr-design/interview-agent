"use client";

import React from "react";
import Link from "next/link";
import StatusChip from "../../components/shared/ui/StatusChip";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen text-text-primary px-space-6 py-space-8 md:py-space-16 max-w-2xl mx-auto overflow-y-auto relative z-10 flex flex-col gap-space-8 pb-20 select-text font-body">
      {/* Header */}
      <div className="border-b border-hairline pb-space-6">
        <StatusChip status="confirm" label="Footnotes" />
        <h1 className="text-3xl md:text-5xl font-display text-text-primary mt-space-3.5 tracking-wide leading-none select-none">
          ABOUT THE AGENT
        </h1>
        <p className="text-xs text-text-muted font-semibold mt-1 select-none uppercase tracking-wider">
          System documentation and technologies catalog.
        </p>
      </div>

      {/* Description copy */}
      <div className="space-y-space-6 text-sm text-text-muted leading-relaxed font-medium">
        <p>
          The AI Technical Interview Agent is an automated evaluation environment built to audit frontend competencies across React and Next.js developer paths.
        </p>
        <p>
          By implementing curriculum-linked sequencing, the platform monitors user dialogue loops in real time to calculate live curriculum coverage and generate granular diagnostic feedback reports detailing candidate match levels, core strengths, and growth targets.
        </p>

        <div>
          <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-widest mb-space-3 font-mono">
            TECHNOLOGY_STACK
          </h3>
          <ul className="space-y-space-2 text-xs font-mono text-accent-focus">
            <li>• Core Framework: Next.js 16 (App Router) + React 19</li>
            <li>• Styling Layout: Tailwind CSS v4 (Theme Variables) + HSL Primitives</li>
            <li>• Graphics Render: React Three Fiber (R3F) + Three.js ExtrudeGeometry</li>
            <li>• Motion Engines: GSAP ScrollTrigger + Framer Motion transitions</li>
            <li>• Scroll Physics: Lenis smooth scrolling integration</li>
            <li>• State Containers: Zustand memory stores</li>
          </ul>
        </div>
      </div>

      {/* Footer Back link */}
      <div className="pt-space-6 border-t border-hairline mt-space-4">
        <Link
          href="/"
          className="inline-flex items-center gap-space-2 text-xs font-mono font-bold text-text-muted hover:text-accent-focus transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 text-accent-focus" />
          <span>Back to dashboard</span>
        </Link>
      </div>
    </div>
  );
}
