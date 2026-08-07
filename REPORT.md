# AI Technical Interview Agent: Project Report & Documentation Guide

This document serves as the comprehensive master report for the **AI Technical Interview Agent** platform, detailing its core objectives, technology stack, directory structure, custom design system, interactive 3D WebGL mechanics, state management, page router flows, and verification status.

---

## 📂 Project Structure Overview

Following a comprehensive cleanup, all client source files and Next.js configurations have been nested inside the `frontend` folder to keep version control clean, while delegator script configurations in the workspace root enable global command execution.

```text
interview-agent/
├── frontend/                     # Next.js 16 nested root
│   ├── public/                   # Static media and SVG icons
│   ├── src/
│   │   ├── app/                  # Route targets and Page views
│   │   │   ├── (landing)/        # Candidate Portal Grid dashboard
│   │   │   ├── about/            # Tech stack footnote page
│   │   │   ├── api/              # Mock turn-based evaluation API
│   │   │   ├── feedback/         # Score summaries and diagnostic reports
│   │   │   ├── insights/         # Cohort trends and gap charts
│   │   │   ├── interview/        # Interactive interview room client
│   │   │   ├── method/           # Protocol stages reveals
│   │   │   └── questions/        # Filterable question curriculum bank
│   │   ├── components/           # UI Elements & Sub-views
│   │   │   ├── feedback/         # Gauges, recharts radar, strengths checkmarks
│   │   │   ├── insights/         # Dynamic charts lazy-loading containers
│   │   │   ├── interview/        # Chat systems, sidebar logs, timers
│   │   │   ├── landing/          # Stats count-up, heroes, filters
│   │   │   └── shared/           # Lenis, Nav, 3D backgrounds, ApertureField
│   │   │       └── ui/           # Custom primitives: Panel, StatusChip, DataReadout
│   │   ├── data/                 # Local data rosters (Candidates, Curriculum)
│   │   ├── hooks/                # Zustand stores and custom hook hooks
│   │   ├── lib/                  # Scoring modules, APIs, and typings
│   │   └── styles/               # CSS design tokens
├── package.json                  # Root delegating runner script
├── REPORT.md                     # Master documentation (this file)
└── frontend_report.md            # Frontend architecture report
```

---

## 🛠️ Technology Stack & Core Primitives

The application uses a high-performance stack designed for visual excellence, performance, and accessibility:

*   **Core Framework**: Next.js 16 (App Router) & React 19.
*   **Styling & Primitives**: Tailwind CSS v4 & HSL Theme Variables.
*   **Physics Scrolling**: Lenis Scroll synchronized with GSAP ticker loop.
*   **3D graphics**: Three.js & React Three Fiber (R3F) for interactive rendering.
*   **Data Visualizations**: Recharts for custom radar charts and progress lines.
*   **State Containers**: Zustand stores managing candidates and feedback caches.

---

## 🎨 Design System & Custom Tokens

We replaced default rounded-card layouts with a sharp, premium dark instrument-panel aesthetic:

### 1. Color Custom Properties (`src/styles/design-tokens.css`)
*   `var(--background)`: `#0B0D10` (Main background)
*   `var(--surface)`: `#14171C` (Subtle panel background)
*   `var(--surface-raised)`: `#1B1F25` (Interactive raised panel)
*   `var(--text-primary)`: `#ECEEF0` (High contrast text)
*   `var(--text-muted)`: `#8B929B` (WCAG 4.5:1 AA contrast compliant)
*   `var(--accent-focus)`: `#4FD3DE` (Cyan target indicator)
*   `var(--accent-resolve)`: `#E8A33D` (Amber warnings)
*   `var(--accent-confirm)`: `#5FD98A` (Green success markers)
*   `var(--hairline)`: `rgba(236, 238, 240, 0.08)` (Thin panel borders)

### 2. Custom Typography
*   **Display Headers**: `Bebas Neue` (uppercase display font)
*   **Paragraphs/Copy**: `Barlow` (weights 400/500/600 for technical readability)
*   **Data Readouts**: `DM Mono` (weights 400/500 for statistics tabular data)

### 3. Layout Primitives
*   **`<Panel />`**: Sharp-edged container utilizing design token variables.
*   **`<StatusChip />`**: Custom labels styled for `focus`, `resolve`, or `confirm`.
*   **`<DataReadout />`**: Numeric displays set in `DM Mono` with sentence-case text.

---

## 🌪️ Signature 3D Aperture & WebGL Optimizations

The signature visual element of the platform is an interactive 3D camera iris/aperture built using React Three Fiber. On low-end hardware and mobile devices, 3D WebGL running at 60fps can cause UI lag. We implemented targeted performance optimizations:

1.  **Mobile/Hardware Fallbacks**: The canvas detects if the device has a mobile viewport (`window.innerWidth < 1024px` or touchscreen support) or low-concurrency processors (`navigator.hardwareConcurrency < 4`).
2.  **GPU Resource Savings**: For these low-performance devices:
    *   R3F's `frameloop` switches to `"demand"`.
    *   Continuous slow rotation animations are disabled.
    *   Pointer coordinates parallax tilts are disabled.
3.  **Lerp Settling Blocks**: During openness changes (scrolling the landing page or checking off curriculum modules), the `<ApertureController />` fires a single 60-frame requestAnimationFrame block to animate the blade transition, then stops, dropping GPU load to **0%** when stationary.
4.  **Tab Sleep Mode**: Rendering pauses when the tab goes out of focus.

---

## 🧩 Product Route Breakdowns

The application incorporates ten total routes:

### 1. Candidate Portal (`/`)
*   **Hero**: Displays large headline in Bebas Neue over a scroll-linked full-bleed `<ApertureField />`. Openness scrubs from 0 (closed) to 1 (fully open at 600px scrolled) via GSAP ScrollTrigger.
*   **StatCards**: Rebuilt in a single hairline-separated grid row with GSAP count-ups.
*   **Roster**: Staggered cards displaying candidates and scores.

### 2. Dialogue Room (`/interview/[candidateId]`)
*   **Aperture binding**: Pinned top-right ambient aperture. Openness is bound to the candidate's real-time curriculum coverage percentage, visually opening as the interview progresses.
*   **Chat**: Chat bubbles with custom code highlighters and an understated pulsing typing indicator.
*   **Sidebars**: Bio details and coverage checklist using focus brackets.

### 3. Feedback Diagnostic (`/feedback/[sessionId]`)
*   **Score Gauge**: Circular score gauge centered over a background `<ApertureField intensity="gauge" />` that counts up on mount.
*   **Radar Chart**: Recharts matrix colored in `accent-focus` with Barlow axes and DM Mono tick numbers. Lazyloaded via `next/dynamic` to optimize initial load bundle sizes.

### 4. Methodology Protocol (`/method`)
*   Details the three stages of the platform (Configure, Interview, Review) inside `<Panel />` elements with Barlow descriptions and DM Mono telemetry specs.

### 5. Curriculum Bank (`/questions`)
*   Lists curriculum days filterable by keyword and competency category.

### 6. Cohort Analytics (`/insights`)
*   Displays average score trends over time (Recharts Line chart), frequent gaps (Recharts Bar chart), and aggregate cohort pass rates. Lazily loaded for bundle efficiency.

### 7. About Footnotes (`/about`)
*   Restrained stack descriptions listing framework, animation, state, and graphics libraries.

---

## 🔍 Validation & Sync Status

1.  **Production Compilation**: Next.js production build (`npm run build`) compiles successfully with zero warnings/errors.
2.  **Git Remote Sync**: All source code commits have been pushed to the remote repository:
    `https://github.com/vrkaurr-design/interview-agent.git`
