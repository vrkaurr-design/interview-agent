# AI Technical Interview Agent: Frontend Architecture & Design System Report

This document details the technical architecture, technology stack, directory structure, custom design system, component hierarchy, WebGL performance optimizations, and routing flows of the **AI Technical Interview Agent** frontend application.

---

## 📂 Project Directory Structure

All Next.js application source files and configurations reside inside the `frontend` directory. The root folder contains delegating scripts for easy workspace execution.

```text
interview-agent/
├── frontend/                     # Nested Next.js application root
│   ├── public/                   # Static assets & SVG icons
│   ├── src/
│   │   ├── app/                  # App Router Pages and API endpoints
│   │   │   ├── (landing)/        # Candidate Dashboard
│   │   │   ├── about/            # Footnote stack specifications
│   │   │   ├── api/              # Turn-based mock API endpoint
│   │   │   ├── design-system/    # Visual tokens test panel
│   │   │   ├── feedback/         # Session diagnostic feedback summaries
│   │   │   ├── insights/         # Cohort analytics trend lines & bars
│   │   │   ├── interview/        # Real-time dialog simulator rooms
│   │   │   └── method/           # Protocol stages reveals
│   │   │   └── questions/        # Filterable curriculum questions bank
│   │   ├── components/           # UI Layout Primitives & Views
│   │   │   ├── feedback/         # Score gauges, Recharts, checklist elements
│   │   │   ├── insights/         # Dynamic imported analytics charts
│   │   │   ├── interview/        # Chat containers, sidebars, headers
│   │   │   ├── landing/          # Heroes, stats rows, flat search filters
│   │   │   └── shared/           # Lenis, Nav, Background3D, ApertureField
│   │   │       └── ui/           # Design System primitives: Panel, StatusChip, DataReadout
│   │   ├── data/                 # Local data models (Candidates, Curriculum)
│   │   ├── hooks/                # Zustand state memory stores
│   │   ├── lib/                  # Helper utilities, scoring, and typings
│   │   └── styles/               # CSS tokens and configurations
│   ├── package.json              # App-level dependencies & scripts
│   ├── tailwind.config.ts        # Tailwind CSS config
│   └── tsconfig.json             # TypeScript settings
├── package.json                  # Root runner scripts delegator
├── .gitignore                    # Version control ignored patterns
└── frontend_report.md            # Technical and architecture guide (this file)
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 16 (App Router) & React 19 | Server Component rendering, page routing, layouts, and hooks. |
| **Styling Engine** | Tailwind CSS v4 & Vanilla CSS | Primitives mapping, design tokens, HSL custom properties, and flat layouts. |
| **Animations** | GSAP 3 & Framer Motion | Timeline scrubbing, count-ups, and transition hooks. |
| **3D Rendering** | Three.js & React Three Fiber (R3F) | 10-blade graphite camera iris/aperture responsive to scroll and pointers. |
| **Performance** | Lenis Scroll | Unified scrolling synchronization with GSAP ticker loop. |
| **Data Viz** | Recharts | Low-opacity polygons, grids, and numeric ticks. |
| **State Engine** | Zustand | Global caching stores for candidates, analytics, and active rooms. |

---

## 🎨 Custom Design System (Tokens & Primitives)

We established a premium, instrument-panel dark aesthetic replacing all generic SaaS rounded-card styles:

### 1. CSS Custom Properties (`src/styles/design-tokens.css`)
Exposes HSL channels on `:root` to allow flexible alpha opacity styling:
*   `--background`: `#0B0D10` (Dark background)
*   `--surface`: `#14171C` (Subtle container surface)
*   `--surface-raised`: `#1B1F25` (Raised interactive surface)
*   `--text-primary`: `#ECEEF0` (Crisp reading text)
*   `--text-muted`: `#8B929B` (Contrast ratio compliant gray text)
*   `--accent-focus`: `#4FD3DE` (Cyan alert/focus)
*   `--accent-resolve`: `#E8A33D` (Amber warning/resolve)
*   `--accent-confirm`: `#5FD98A` (Green success/confirm)
*   `--hairline`: `rgba(236, 238, 240, 0.08)` (Thin dividers)
*   **Spacing**: 4px base scale (`var(--space-1)` to `var(--space-20)`)
*   **Radii**: Sharp `0px`, `2px`, and `6px` maximum bounds.

### 2. Typography Config
*   **Display Font**: `Bebas Neue` (massive uppercase headers)
*   **Body Font**: `Barlow` (weights 400/500/600 for clear technical copy)
*   **Data Font**: `DM Mono` (weights 400/500 for tabular status readouts)

### 3. Core UI Primitives (`src/components/shared/ui/`)
*   **`Panel.tsx`**: Sharp, hairline-bordered container utilizing custom margins.
*   **`StatusChip.tsx`**: Renders custom tags mapped to `confirm`, `resolve`, or `focus` styles.
*   **`DataReadout.tsx`**: Flat numerical stat readout in `DM Mono` with sentence-case labels.

---

## 🌪️ 3D Aperture Background & WebGL Optimizations

The signature element is an interactive 10-blade camera iris/aperture built using React Three Fiber. It is optimized to prevent performance degradation on low-end and mobile environments:

### 1. Dynamic Lerping & Interaction
*   Blades are positioned radially and rotated.
*   The `openness` prop (0 = closed, 1 = fully open) is lerped smoothly (`THREE.MathUtils.lerp`) inside the `useFrame` loop.
*   Continuous idle rotation (1 turn/90s) and pointer coordinates parallax tilt (max 6 degrees) add organic movement.

### 2. Mobile and Low-End GPU Safeguards
*   **Hardware and Viewport Detection**: On viewport widths `< 1024px`, touchscreen hardware, or low CPU concurrency (`navigator.hardwareConcurrency < 4`), the Canvas:
    1.  Sets `frameloop` to `"demand"`.
    2.  Disables pointer parallax updates.
    3.  Deactivates continuous idle rotations.
*   **ApertureController Loop Invalidation**: When in demand-loop mode, a state change to `openness` triggers a localized `requestAnimationFrame` block of exactly 60 ticks to complete the lerp, and then shuts down the render pipeline, keeping GPU load at **0%** when stationary.
*   **Tab Sleep**: Listens to visibility changes to suspend loops when the browser tab is out of focus.

---

## 🧩 Page & Route Implementations

### 1. Dashboard (`/`)
*   **Background**: `<ApertureField intensity="hero" />` openness bound to scroll via GSAP ScrollTrigger timeline.
*   **Stats**: Counts up candidate totals on enter viewport.
*   **Filters**: Underscored inputs and toggle status chips.
*   **Listings**: Staggered cards with custom data score readouts.

### 2. Dialogue Room (`/interview/[candidateId]`)
*   **Background**: `<ApertureField intensity="ambient" />` pinned top-right. Openness is bound to the candidate's real-time curriculum coverage percentage, opening as more topics are covered.
*   **Chat**: Barlow chat bubbles, custom lightweight code highlighters, and understated pulsing dots for the thinking state.
*   **Sidebars**: Profile logs and coverage status lists utilizing focus brackets.

### 3. Session Diagnostics (`/feedback/[sessionId]`)
*   **Score Gauge**: Circular gauge overlaying a background `<ApertureField intensity="gauge" />` that counts up on mount.
*   **Radar Chart**: Recharts matrix colored in `accent-focus` with Barlow axes and DM Mono tick numbers.
*   **Action Row**: Flat buttons with sentence-case labels: "Save report" (primary filled), "Schedule follow-up" (hairline bordered), and "Back to dashboard" (hairline bordered).

### 4. Evaluation Methodology (`/method`)
*   Explains the configuration, dialogue, and diagnostic stages of the platform inside `<Panel />` cards, combining Barlow descriptions with DM Mono telemetry specs.

### 5. Curriculum Bank (`/questions`)
*   A filterable questions catalog grouping the 30-day curriculum topics into the six competency areas used by the scoring engine.

### 6. Cohort Analytics (`/insights`)
*   Pulls diagnostic stats across all completed interviews from the Zustand store. Renders a Recharts Line chart of score trends over time and a Bar chart of constructive gap frequencies.
*   **Dynamic Bundle Optimizations**: Packaged Recharts inside lazyloaded components (`next/dynamic`) to speed up page loads.

### 7. Footnotes (`/about`)
*   Restrained stack specifications in Barlow copy with a back link to the main dashboard.

---

## 🔍 Validation & Accessibility Audit
*   **Next.js Production Build**: Compiles successfully with zero warnings/errors (`npm run build`).
*   **A11y Focus Rings**: Added visible keyboard outlines (`focus-visible`) to all interactive elements globally.
*   **Contrast Compliance**: Verified `#8B929B` (text-muted) against `#0B0D10` (background) yields a **6.23:1 contrast ratio**, exceeding the WCAG 4.5:1 AA regular text requirement.
*   **Reduced Motion**: Respected media preferences across Lenis scroll, GSAP staggers, and the R3F WebGL canvas.
