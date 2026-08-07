"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // 1. Entrance animation on mount
        const tl = gsap.timeline();
        tl.fromTo(
            titleRef.current,
            { opacity: 0, y: 30, filter: "blur(5px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
        )
            .fromTo(
                subRef.current,
                { opacity: 0, y: 20, filter: "blur(3px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
                "-=0.5"
            )
            .fromTo(
                ctaRef.current,
                { opacity: 0, y: 15, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
                "-=0.4"
            );

        // 2. Subtle scroll parallax
        let ctx = gsap.context(() => {
            if (containerRef.current) {
                gsap.to([titleRef.current, subRef.current, ctaRef.current], {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                    y: (i) => (i + 1) * 35,
                    opacity: 0.2,
                    ease: "none",
                });
            }
        }, containerRef);

        return () => {
            ctx.revert();
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
            className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 overflow-hidden"
        >
            <div className="max-w-4xl mx-auto space-y-6 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary rounded-full animate-pulse">
                    ⚡ Automated Candidate Matrix
                </div>

                <h1
                    ref={titleRef}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 select-none pb-2"
                >
                    ABTalks AI Cohort <br />
                    <span className="text-primary font-black">Interview Readiness</span>
                </h1>

                <p
                    ref={subRef}
                    className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Evaluate cognitive learning loops, trace curriculum progression milestones, and run interactive AI interview sessions in real-time.
                </p>

                <div className="pt-4">
                    <button
                        ref={ctaRef}
                        onClick={handleScrollToGrid}
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl overflow-hidden shadow-[0_0_20px_rgba(109,94,245,0.4)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(109,94,245,0.75)] hover:scale-105"
                    >
                        <span className="absolute inset-0 bg-white/10 translate-y-full skew-y-12 transition-transform duration-500 group-hover:translate-y-0" />
                        <span className="relative z-10 flex items-center gap-2">
                            Start Candidate Evaluation
                            <ArrowDown className="w-5 h-5 animate-bounce group-hover:translate-y-0.5 transition-transform duration-300" />
                        </span>
                    </button>
                </div>
            </div>

            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/10 blur-3xl pointer-events-none rounded-full" />
        </div>
    );
}
