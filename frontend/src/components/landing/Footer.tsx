"use client";

import React from "react";

export default function Footer() {
    return (
        <footer className="w-full max-w-6xl mx-auto px-space-6 py-space-8 mt-space-16 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-space-4 text-[10px] text-text-muted font-body font-semibold tracking-wider uppercase">
            <div>
                <span>© {new Date().getFullYear()} ABTalks AI Cohort. Powered by Next.js & React Three Fiber.</span>
            </div>
            <div className="flex gap-space-6">
                <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-text-primary transition-colors">Cohort Support</a>
            </div>
        </footer>
    );
}
