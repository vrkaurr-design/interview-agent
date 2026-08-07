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
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
        },
    },
    plugins: [],
};

export default config;
