"use client";

import React from "react";

export default function Footer() {
    return (
        <footer className="w-full max-w-6xl mx-auto px-4 py-8 mt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div>
                <span>© {new Date().getFullYear()} ABTalks AI Cohort. Powered by Next.js & React Three Fiber.</span>
            </div>
            <div className="flex gap-6">
                <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-slate-300 transition-colors">Cohort Support</a>
            </div>
        </footer>
    );
}
