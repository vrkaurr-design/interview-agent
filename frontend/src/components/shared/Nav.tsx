"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "./LenisProvider";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Interview", href: "/interview/cand-1" },
  { label: "Insights", href: "/insights" },
  { label: "Question Bank", href: "/questions" },
  { label: "Method", href: "/method" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = (e: any) => {
      setScrolled(e.scroll > 80);
    };

    lenis.on("scroll", handleScroll);
    setScrolled(lenis.scroll > 80);

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-space-6 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-[#14171C]/95 border-b border-hairline backdrop-blur-md"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Product Mark: SVG 6-blade Aperture Logo + Name */}
      <Link href="/" className="flex items-center gap-space-3 group">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent-focus transition-transform duration-700 group-hover:rotate-90"
        >
          <circle cx="12" cy="12" r="10" className="opacity-25" />
          <path d="M12 2 L19 12" />
          <path d="M19 12 L14 21.5" />
          <path d="M14 21.5 L5 19" />
          <path d="M5 19 L2 10" />
          <path d="M2 10 L9 3.5" />
          <path d="M9 3.5 L12 2" />
        </svg>
        <span className="font-display tracking-widest text-text-primary text-lg font-semibold group-hover:text-accent-focus transition-colors">
          AI INTERVIEW AGENT
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-space-6">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative py-1 group font-body text-xs font-semibold tracking-wider uppercase text-text-muted hover:text-text-primary transition-colors"
            >
              {item.label}
              {/* Active Route Indicator: grows from center, 1px height */}
              <span
                className={`absolute bottom-0 left-1/2 h-[1px] bg-accent-focus -translate-x-1/2 transition-all duration-300 ${
                  active ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          );
        })}
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        className="md:hidden p-space-2 hover:bg-surface-raised border border-hairline rounded-sm text-text-muted hover:text-text-primary transition-all cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#14171C]/95 border-b border-hairline backdrop-blur-md p-space-4 flex flex-col gap-space-3 md:hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-space-2 px-space-3 text-xs font-body font-semibold tracking-wider uppercase rounded-sm border-l-2 ${
                  active
                    ? "border-accent-focus text-text-primary bg-surface-raised"
                    : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface-raised/50"
                } transition-all`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
