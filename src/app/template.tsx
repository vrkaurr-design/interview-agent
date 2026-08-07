"use client";

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence mode="wait">
            <PageTransition>{children}</PageTransition>
        </AnimatePresence>
    );
}
