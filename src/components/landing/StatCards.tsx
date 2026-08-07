"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, TrendingUp, Calendar, MessageSquare } from "lucide-react";
import GlassPanel from "../shared/GlassPanel";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function StatCards() {
    const containerRef = useRef<HTMLDivElement>(null);
    const candRef = useRef<HTMLSpanElement>(null);
    const complRef = useRef<HTMLSpanElement>(null);
    const curRef = useRef<HTMLSpanElement>(null);
    const intRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const stats = [
            { ref: candRef, target: 8, suffix: "" },
            { ref: complRef, target: 81, suffix: "%" },
            { ref: curRef, target: 31, suffix: " Days" },
            { ref: intRef, target: 24, suffix: "" },
        ];

        let ctx = gsap.context(() => {
            stats.forEach((item) => {
                if (!item.ref.current) return;
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: item.target,
                    duration: 1.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 88%",
                        toggleActions: "play none none none",
                    },
                    onUpdate: () => {
                        if (item.ref.current) {
                            item.ref.current.innerText = Math.floor(obj.val).toString() + item.suffix;
                        }
                    },
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="max-w-6xl mx-auto px-4 py-8"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <GlassPanel hover className="flex flex-col items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Candidates</h3>
                        <span ref={candRef} className="text-3xl font-extrabold text-white mt-1 block tabular-nums">0</span>
                    </div>
                </GlassPanel>

                <GlassPanel hover className="flex flex-col items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Completion</h3>
                        <span ref={complRef} className="text-3xl font-extrabold text-white mt-1 block tabular-nums">0%</span>
                    </div>
                </GlassPanel>

                <GlassPanel hover className="flex flex-col items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Curriculum</h3>
                        <span ref={curRef} className="text-3xl font-extrabold text-white mt-1 block tabular-nums">0 Days</span>
                    </div>
                </GlassPanel>

                <GlassPanel hover className="flex flex-col items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interviews Run</h3>
                        <span ref={intRef} className="text-3xl font-extrabold text-white mt-1 block tabular-nums">0</span>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
