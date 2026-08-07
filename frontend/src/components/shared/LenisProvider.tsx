"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = React.useState<Lenis | null>(null);

  useEffect(() => {
    // Detect prefers-reduced-motion setting
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initialize Lenis with smooth wheel disabled if user prefers reduced motion
    const inst = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      smoothWheel: !prefersReducedMotion,
    });

    setLenis(inst);

    // Synchronize Lenis loop with GSAP ticker
    const tick = (time: number) => {
      // gsap.ticker provides time in seconds, lenis expects milliseconds
      inst.raf(time * 1000);
    };

    gsap.ticker.add(tick);

    // Clean up ticker synchronization and destroy lenis instance on unmount
    return () => {
      gsap.ticker.remove(tick);
      inst.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
