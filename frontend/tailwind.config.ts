import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6D5EF5",
                secondary: "#3ED9C8",
                chartAccent: "#3ED9C8",
                strength: "#34D399",
                caution: "#FBBF24",
                gap: "#F87171",
                bgDarkStart: "#0A0B10",
                bgDarkEnd: "#12141C",

                /* Design System Colors */
                background: "var(--background)",
                surface: "var(--surface)",
                "surface-raised": "var(--surface-raised)",
                "text-primary": "var(--text-primary)",
                "text-muted": "var(--text-muted)",
                "accent-focus": "var(--accent-focus)",
                "accent-resolve": "var(--accent-resolve)",
                "accent-confirm": "var(--accent-confirm)",
                hairline: "var(--hairline)",
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
                display: ["var(--font-bebas-neue)", "sans-serif"],
                body: ["var(--font-barlow)", "sans-serif"],
            },
            spacing: {
                "space-1": "var(--space-1)",
                "space-2": "var(--space-2)",
                "space-3": "var(--space-3)",
                "space-4": "var(--space-4)",
                "space-5": "var(--space-5)",
                "space-6": "var(--space-6)",
                "space-8": "var(--space-8)",
                "space-10": "var(--space-10)",
                "space-12": "var(--space-12)",
                "space-16": "var(--space-16)",
                "space-20": "var(--space-20)",
            },
            borderRadius: {
                none: "var(--radius-none)",
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
            },
        },
    },
    plugins: [],
};

export default config;
