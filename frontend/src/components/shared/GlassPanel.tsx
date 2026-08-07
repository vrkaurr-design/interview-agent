"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    hover?: boolean;
}

export default function GlassPanel({
    children,
    className,
    hover = false,
    ...props
}: GlassPanelProps) {
    return (
        <div
            className={twMerge(
                "glass-panel rounded-2xl p-6",
                hover ? "hover:shadow-[0_0_30px_rgba(109,94,245,0.2)] hover:border-primary/40 hover:scale-[1.01]" : "",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
