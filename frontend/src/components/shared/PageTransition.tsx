"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useApertureStore } from "./Background3D";

interface PageTransitionProps {
  children?: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    // Detect route change
    if (pathname !== prevPath) {
      setPrevPath(pathname);

      const setOpenness = useApertureStore.getState().setOpenness;

      // Transition timeline (under 400ms total)
      // 1. Rack closed to 0.2 instantly on route trigger
      setOpenness(0.2);

      // 2. Rack back open to 0.8 (or 0.0 if landing page) after 180ms
      const timer = setTimeout(() => {
        setOpenness(pathname === "/" ? 0.0 : 0.8);
      }, 180);

      return () => clearTimeout(timer);
    }
  }, [pathname, prevPath]);

  return (
    <>
      {/* Content wrapper with the original fade & blur motion animation */}
      {children && (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex-1 flex flex-col w-full"
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
