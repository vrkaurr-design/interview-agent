"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { create } from "zustand";
import ApertureField from "./ApertureField";

interface ApertureState {
  openness: number;
  setOpenness: (val: number) => void;
}

export const useApertureStore = create<ApertureState>((set) => ({
  openness: 0.8,
  setOpenness: (val) => set({ openness: val }),
}));

export default function Background3D() {
  const pathname = usePathname();
  const openness = useApertureStore((state) => state.openness);

  const intensity = pathname === "/" ? "hero" : "ambient";

  return <ApertureField openness={openness} intensity={intensity} />;
}
