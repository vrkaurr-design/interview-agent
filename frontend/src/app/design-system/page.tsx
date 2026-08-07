"use client";

import React, { useState } from "react";
import Panel from "../../components/shared/ui/Panel";
import DataReadout from "../../components/shared/ui/DataReadout";
import StatusChip from "../../components/shared/ui/StatusChip";
import ApertureField from "../../components/shared/ApertureField";

export default function DesignSystemPage() {
  const [openness, setOpenness] = useState(0.5);
  const [intensity, setIntensity] = useState<"ambient" | "hero">("hero");

  return (
    <div className="container mx-auto px-space-6 py-space-12 max-w-5xl">
      {/* Header */}
      <div className="mb-space-10 border-b border-hairline pb-space-4">
        <h1 className="text-5xl font-display tracking-wide mb-space-2 text-accent-focus">
          DESIGN SYSTEM PRIMITIVES
        </h1>
        <p className="font-body text-text-muted text-sm uppercase tracking-wider">
          AI Technical Interview Agent • Instrument-Panel Aesthetic
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-8">
        {/* Left Column: Core Tokens */}
        <div className="flex flex-col gap-space-8">
          {/* Colors Section */}
          <Panel className="p-space-6">
            <h2 className="text-lg font-body font-semibold tracking-wider uppercase mb-space-4 text-text-primary border-b border-hairline pb-space-2">
              Color Primitives
            </h2>
            <div className="grid grid-cols-1 gap-space-3">
              {[
                { name: "Background", var: "var(--background)", val: "#0B0D10", text: "text-text-muted" },
                { name: "Surface", var: "var(--surface)", val: "#14171C", text: "text-text-muted" },
                { name: "Surface Raised", var: "var(--surface-raised)", val: "#1B1F25", text: "text-text-muted" },
                { name: "Text Primary", var: "var(--text-primary)", val: "#ECEEF0", text: "text-background" },
                { name: "Text Muted", var: "var(--text-muted)", val: "#8B929B", text: "text-background" },
                { name: "Accent Focus", var: "var(--accent-focus)", val: "#4FD3DE", text: "text-background" },
                { name: "Accent Resolve", var: "var(--accent-resolve)", val: "#E8A33D", text: "text-background" },
                { name: "Accent Confirm", var: "var(--accent-confirm)", val: "#5FD98A", text: "text-background" },
                { name: "Hairline", var: "var(--hairline)", val: "rgba(236,238,240,0.08)", text: "text-text-primary" },
              ].map((color) => (
                <div key={color.name} className="flex items-center justify-between border border-hairline p-space-2 rounded-sm bg-surface">
                  <div className="flex items-center gap-space-3">
                    <div
                      className="w-space-8 h-space-8 rounded-sm border border-hairline"
                      style={{ backgroundColor: color.var }}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold font-body text-text-primary">{color.name}</span>
                      <span className="text-[10px] font-mono text-text-muted">{color.val}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted bg-background px-space-2 py-0.5 rounded-sm">
                    {color.var}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Spacing & Radii */}
          <Panel className="p-space-6">
            <h2 className="text-lg font-body font-semibold tracking-wider uppercase mb-space-4 text-text-primary border-b border-hairline pb-space-2">
              Spacing & Radii Scales
            </h2>

            {/* Radius */}
            <div className="mb-space-6">
              <h3 className="text-xs font-body font-semibold text-text-muted uppercase mb-space-2 tracking-wider">
                Radius Scale
              </h3>
              <div className="flex gap-space-4">
                {[
                  { name: "radius-none", val: "0px", class: "rounded-none" },
                  { name: "radius-sm", val: "2px", class: "rounded-sm" },
                  { name: "radius-md", val: "rounded-md" }, // maps to var(--radius-md) i.e. 6px
                ].map((rad) => (
                  <div
                    key={rad.name}
                    className={`flex-1 h-space-12 bg-surface-raised border border-accent-focus/30 ${rad.class} flex flex-col justify-center items-center`}
                  >
                    <span className="text-[10px] font-mono text-text-primary">{rad.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h3 className="text-xs font-body font-semibold text-text-muted uppercase mb-space-2 tracking-wider">
                Spacing Scale
              </h3>
              <div className="flex flex-col gap-space-2">
                {[
                  { name: "space-1 (4px)", style: { width: "var(--space-1)" } },
                  { name: "space-2 (8px)", style: { width: "var(--space-2)" } },
                  { name: "space-3 (12px)", style: { width: "var(--space-3)" } },
                  { name: "space-4 (16px)", style: { width: "var(--space-4)" } },
                  { name: "space-6 (24px)", style: { width: "var(--space-6)" } },
                  { name: "space-8 (32px)", style: { width: "var(--space-8)" } },
                  { name: "space-12 (48px)", style: { width: "var(--space-12)" } },
                ].map((sp) => (
                  <div key={sp.name} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-text-muted">{sp.name}</span>
                    <div className="h-2 bg-accent-focus/30 rounded-sm" style={sp.style} />
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* Aperture Control Panel */}
          <Panel className="p-space-6">
            <h2 className="text-lg font-body font-semibold tracking-wider uppercase mb-space-4 text-text-primary border-b border-hairline pb-space-2">
              3D Aperture Component Testing
            </h2>
            <div className="flex flex-col gap-space-4">
              <div className="flex flex-col gap-space-1">
                <label className="text-[10px] font-body text-text-muted uppercase tracking-wider font-bold">
                  Openness: {openness.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={openness}
                  onChange={(e) => setOpenness(parseFloat(e.target.value))}
                  className="w-full h-1 bg-surface-raised rounded-sm appearance-none cursor-pointer accent-accent-focus border border-hairline"
                />
              </div>

              <div className="flex flex-col gap-space-1">
                <label className="text-[10px] font-body text-text-muted uppercase tracking-wider font-bold">
                  Intensity / Scale
                </label>
                <div className="flex gap-space-2">
                  <button
                    onClick={() => setIntensity("hero")}
                    className={`flex-1 py-1.5 px-3 rounded-sm font-mono text-[10px] font-bold border transition-all ${
                      intensity === "hero"
                        ? "bg-accent-focus/15 border-accent-focus text-accent-focus"
                        : "border-hairline bg-surface text-text-muted hover:text-text-primary"
                    }`}
                  >
                    HERO (FULL SCREEN)
                  </button>
                  <button
                    onClick={() => setIntensity("ambient")}
                    className={`flex-1 py-1.5 px-3 rounded-sm font-mono text-[10px] font-bold border transition-all ${
                      intensity === "ambient"
                        ? "bg-accent-focus/15 border-accent-focus text-accent-focus"
                        : "border-hairline bg-surface text-text-muted hover:text-text-primary"
                    }`}
                  >
                    AMBIENT (CORNER)
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column: Typography & Components */}
        <div className="flex flex-col gap-space-8">
          {/* Typography Section */}
          <Panel className="p-space-6">
            <h2 className="text-lg font-body font-semibold tracking-wider uppercase mb-space-4 text-text-primary border-b border-hairline pb-space-2">
              Typography
            </h2>
            <div className="flex flex-col gap-space-4">
              <div>
                <span className="text-[10px] font-body text-text-muted uppercase tracking-wider block mb-space-1">
                  Display Font (Bebas Neue)
                </span>
                <p className="text-4xl font-display tracking-wider text-text-primary">
                  THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
                </p>
              </div>

              <div className="border-t border-hairline pt-space-3">
                <span className="text-[10px] font-body text-text-muted uppercase tracking-wider block mb-space-1">
                  Body Font (Barlow)
                </span>
                <p className="text-sm font-body text-text-primary font-normal leading-relaxed mb-space-2">
                  Barlow is a clean, low-contrast, and slightly condensed body typeface. It fits exceptionally well in instrument-panel dashboards that present high information density.
                </p>
                <p className="text-sm font-body text-text-primary font-medium mb-space-2">
                  Medium Weight (500) - Used for highlighted descriptions and buttons.
                </p>
                <p className="text-sm font-body text-text-primary font-semibold">
                  Semibold Weight (600) - Used for subheadings and section headers.
                </p>
              </div>

              <div className="border-t border-hairline pt-space-3">
                <span className="text-[10px] font-body text-text-muted uppercase tracking-wider block mb-space-1">
                  Data Font (DM Mono)
                </span>
                <p className="text-sm font-mono text-text-primary font-normal tracking-tight">
                  DM Mono 400: const score = 92.4; // evaluation data
                </p>
                <p className="text-sm font-mono text-text-primary font-semibold tracking-tight">
                  DM Mono 500: Active_Evaluations = 1024;
                </p>
              </div>
            </div>
          </Panel>

          {/* UI Primitives Section */}
          <Panel className="p-space-6">
            <h2 className="text-lg font-body font-semibold tracking-wider uppercase mb-space-4 text-text-primary border-b border-hairline pb-space-2">
              UI Primitives
            </h2>

            {/* Panels & Glass Containers */}
            <div className="mb-space-6">
              <h3 className="text-xs font-body font-semibold text-text-muted uppercase mb-space-2 tracking-wider">
                Panel (Glass Container)
              </h3>
              <Panel className="p-space-4 bg-surface-raised flex flex-col gap-2">
                <span className="text-[10px] font-mono text-accent-focus">PANEL_NODE_SYS</span>
                <p className="text-xs font-body text-text-muted">
                  A subtle backdrop-blur (max 8px) container with surface-raised color (#1B1F25) and a hairline border. It provides high readability and a clean contrast.
                </p>
              </Panel>
            </div>

            {/* DataReadout Component */}
            <div className="mb-space-6">
              <h3 className="text-xs font-body font-semibold text-text-muted uppercase mb-space-2 tracking-wider">
                DataReadout Components
              </h3>
              <div className="grid grid-cols-3 gap-space-4 bg-surface border border-hairline p-space-4 rounded-sm">
                <DataReadout label="MATCH SCORE" value={95} unit="%" />
                <DataReadout label="INTERVIEW ID" value="1092" />
                <DataReadout label="COMPILATION" value="2.4" unit="s" />
              </div>
            </div>

            {/* StatusChip Component */}
            <div>
              <h3 className="text-xs font-body font-semibold text-text-muted uppercase mb-space-2 tracking-wider">
                StatusChips
              </h3>
              <div className="flex gap-space-3 bg-surface border border-hairline p-space-4 rounded-sm">
                <StatusChip status="focus" />
                <StatusChip status="resolve" />
                <StatusChip status="confirm" />
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Focus Rail Demonstration */}
      <div className="mt-space-12 border-t border-hairline pt-space-4 text-center">
        <p className="text-xs font-mono text-text-muted">
          Note: Look at the left edge of the viewport to view the active <span className="text-accent-focus font-bold">&lt;FocusRail /&gt;</span> running with ticks every 80px.
        </p>
      </div>

      {/* 3D Aperture Component rendering */}
      <ApertureField openness={openness} intensity={intensity} />
    </div>
  );
}
