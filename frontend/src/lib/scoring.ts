import { InterviewFeedback } from "./types";

interface CoverageInput {
    questionsAsked: number;
    daysCovered: number;
    modulesCovered: string[];
}

export const scoring = {
    /**
     * Calculates overall candidate score based on:
     * - Base weight of 50 points
     * - Strengths count (up to +40 points)
     * - Growth gaps count (up to -30 points)
     * - Coverage multipliers (up to +10 points) representing min target questions (8) and curriculum units (4)
     */
    computeOverallScore: (feedback: InterviewFeedback, coverage: CoverageInput): number => {
        const base = 50;

        // Strengths bonus: +8 per item, max +40
        const strengthsBonus = Math.min((feedback.strengths || []).length * 8, 40);

        // Gaps penalty: -6 per item, max -30
        const gapsPenalty = Math.min((feedback.gaps || []).length * 6, 30);

        // Coverage bonus: up to +10 based on session target metrics
        const questionRatio = Math.min(coverage.questionsAsked / 8, 1);
        const dayRatio = Math.min(coverage.daysCovered / 4, 1);
        const coverageBonus = Math.round(10 * questionRatio * dayRatio);

        const total = base + strengthsBonus - gapsPenalty + coverageBonus;
        return Math.max(0, Math.min(total, 100));
    },

    /**
     * Computes a 0-100 chart coordinate per learning module:
     * - Modules covered start with neutral baseline of 60.
     * - Boost (+15) if strengths statements mention related keywords.
     * - Drags (-20) if growth gaps mention related keywords.
     * - Uncovered modules receive 0.
     */
    computeModuleRadar: (feedback: InterviewFeedback, modulesCovered: string[]): { module: string; score: number }[] => {
        const allModules = [
            "React Hooks & Rendering",
            "State Management",
            "Next.js Routing & RSCs",
            "Graphics (Three.js)",
            "Testing & Integration",
            "Architecture & Builds"
        ];

        const strengthsText = (feedback.strengths || []).join(" ").toLowerCase();
        const gapsText = (feedback.gaps || []).join(" ").toLowerCase();

        return allModules.map((moduleName) => {
            // If the module was not touched during the interview session, set rating to 0
            const isTouched = modulesCovered.includes(moduleName);
            if (!isTouched) {
                return { module: moduleName, score: 0 };
            }

            let score = 60; // neutral base for evaluated criteria

            // Apply modifiers based on qualitative responses
            const keywords: Record<string, string[]> = {
                "React Hooks & Rendering": ["react", "hook", "render", "dom", "context"],
                "State Management": ["zustand", "state", "store", "global", "context"],
                "Next.js Routing & RSCs": ["next", "route", "server", "rsc", "action"],
                "Graphics (Three.js)": ["three", "r3f", "webgl", "canvas", "particle"],
                "Testing & Integration": ["test", "vitest", "playwright", "mock", "integration"],
                "Architecture & Builds": ["build", "webpack", "compile", "bundler", "optimize"]
            };

            const modKeywords = keywords[moduleName] || [];

            // Check if keyword is flagged in strengths
            const isStrength = modKeywords.some(kw => strengthsText.includes(kw));
            if (isStrength) {
                score += 15;
            }

            // Check if keyword is flagged in gaps
            const isGap = modKeywords.some(kw => gapsText.includes(kw));
            if (isGap) {
                score -= 20;
            }

            return {
                module: moduleName,
                score: Math.max(0, Math.min(score, 100))
            };
        });
    }
};
