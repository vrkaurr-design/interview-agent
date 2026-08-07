"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ApertureFieldProps {
  openness: number; // 0 (closed) to 1 (open)
  intensity?: "ambient" | "hero" | "gauge";
  scrollProgressRef?: React.RefObject<{ value: number }>;
}

// 1. Blade Component containing the 3D meshes
function ApertureScene({
  openTarget,
  reducedMotion,
  isLowEnd,
  scrollProgressRef,
}: {
  openTarget: number;
  reducedMotion: boolean;
  isLowEnd: boolean;
  scrollProgressRef?: React.RefObject<{ value: number }>;
}) {
  const assemblyRef = useRef<THREE.Group>(null);
  const bladesRefs = useRef<(THREE.Group | null)[]>([]);
  const currentOpenness = useRef(openTarget);

  const { pointer } = useThree();

  // Create the custom blade 2D path
  const bladeShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.2, 0.4);
    shape.lineTo(0.1, 0.85);
    shape.lineTo(-0.35, 0.8);
    shape.lineTo(-0.4, 0.35);
    shape.closePath();
    return shape;
  }, []);

  // Extrude settings for high-quality graphite bevels
  const extrudeSettings = useMemo(
    () => ({
      steps: 1,
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.01,
      bevelOffset: 0,
      bevelSegments: 2,
    }),
    []
  );

  // Geometry instance shared across all 10 blades
  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
  }, [bladeShape, extrudeSettings]);

  // Premium graphite material with low-intensity cyan emissive outline highlight
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#181C22",
      roughness: 0.45,
      metalness: 0.8,
      emissive: "#4FD3DE",
      emissiveIntensity: 0.16,
    });
  }, []);

  // Build the radial arrangement layout
  const blades = useMemo(() => {
    const list = [];
    const count = 10;
    const radius = 0.8;

    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Z-offset is critical to prevent graphic z-fighting overlaps
      const z = i * 0.012;

      list.push({
        id: i,
        position: [x, y, z] as [number, number, number],
        baseAngle: angle,
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    // 1. Lerp openness value
    const target = scrollProgressRef?.current ? scrollProgressRef.current.value : openTarget;
    currentOpenness.current = THREE.MathUtils.lerp(
      currentOpenness.current,
      target,
      0.08
    );

    // Calculate rotational angle for the blades
    const baseRot = 1.83;
    const openRot = 0.87;
    const sweepAngle = baseRot + currentOpenness.current * (openRot - baseRot);

    // Apply rotation around the pivot group
    bladesRefs.current.forEach((bladeGroup) => {
      if (bladeGroup) {
        bladeGroup.rotation.z = sweepAngle;
      }
    });

    // Skip continuous idle animations if prefers-reduced-motion or mobile/low-end is active
    if (!reducedMotion && !isLowEnd && assemblyRef.current) {
      // 2. Slow idle rotation (1 full turn/90s)
      assemblyRef.current.rotation.z += ((Math.PI * 2) / 90) * delta;

      // 3. Pointer Parallax tilt (pitch/yaw, max ~6 degrees/0.1 radians)
      const targetRotX = -pointer.y * 0.1;
      const targetRotY = pointer.x * 0.1;

      assemblyRef.current.rotation.x = THREE.MathUtils.lerp(
        assemblyRef.current.rotation.x,
        targetRotX,
        0.05
      );
      assemblyRef.current.rotation.y = THREE.MathUtils.lerp(
        assemblyRef.current.rotation.y,
        targetRotY,
        0.05
      );
    }
  });

  return (
    <group ref={assemblyRef}>
      {blades.map((blade, idx) => (
        <group
          key={blade.id}
          position={blade.position}
          rotation={[0, 0, blade.baseAngle]}
        >
          <group
            ref={(el) => {
              bladesRefs.current[idx] = el;
            }}
          >
            <mesh geometry={geometry} material={material} />
          </group>
        </group>
      ))}
    </group>
  );
}

// 2. Controller component to trigger rendering on openness changes in demand mode
function ApertureController({
  openness,
  isDemand,
}: {
  openness: number;
  isDemand: boolean;
}) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (isDemand) {
      // Trigger a block of 60 frames to finish the openness lerp
      let count = 0;
      let frameId: number;
      const tick = () => {
        invalidate();
        count++;
        if (count < 60) {
          frameId = requestAnimationFrame(tick);
        }
      };
      tick();
      return () => cancelAnimationFrame(frameId);
    }
  }, [openness, isDemand, invalidate]);

  return null;
}

// 3. Main Export Component wrapped in React.memo
function ApertureField({ openness, intensity = "hero", scrollProgressRef }: ApertureFieldProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [frameloop, setFrameloop] = useState<"always" | "demand">("always");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    // Detect mobile or low concurrency hardware (slow/laggy devices)
    const isMobile = window.innerWidth < 1024 || navigator.maxTouchPoints > 0;
    const isLowPowerHardware = typeof navigator !== "undefined" && 
      (navigator.hardwareConcurrency < 4 || (navigator as any).deviceMemory < 4);

    const lowEnd = mediaQuery.matches || isMobile || isLowPowerHardware;
    setIsLowEnd(lowEnd);
    setFrameloop(lowEnd ? "demand" : "always");

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      const low = e.matches || isMobile || isLowPowerHardware;
      setIsLowEnd(low);
      setFrameloop(low ? "demand" : "always");
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Tab visibility handling to save energy when hidden
    const handleVisibility = () => {
      if (document.hidden) {
        setFrameloop("demand");
      } else {
        setFrameloop(mediaQuery.matches || isMobile || isLowPowerHardware ? "demand" : "always");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Determine wrapper layout styling based on intensity prop
  const wrapperClass = useMemo(() => {
    if (intensity === "hero") {
      return "fixed inset-0 w-full h-full -z-20 pointer-events-none bg-[#0B0D10] opacity-40 transition-all duration-1000";
    }
    if (intensity === "gauge") {
      return "absolute inset-0 w-full h-full -z-10 pointer-events-none bg-transparent opacity-45 transition-all duration-1000";
    }
    // Ambient smaller corner layout
    return "fixed top-space-12 right-space-12 w-[300px] h-[300px] -z-20 pointer-events-none opacity-20 transition-all duration-1000 bg-transparent";
  }, [intensity]);

  const scale: [number, number, number] = useMemo(() => {
    if (intensity === "hero") return [2.2, 2.2, 2.2];
    if (intensity === "gauge") return [1.4, 1.4, 1.4];
    return [1.2, 1.2, 1.2];
  }, [intensity]);

  return (
    <div className={wrapperClass}>
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.5]} // Performance: limit max pixel ratio on low-end
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
      >
        {/* Ambient fill light */}
        <ambientLight intensity={0.18} color="#FFFFFF" />

        {/* Dim accent key light */}
        <directionalLight position={[3, 3, 4]} intensity={0.9} color="#4FD3DE" />

        {/* Specular fill light for edge highlighting */}
        <directionalLight position={[-2, -2, 3]} intensity={0.3} color="#FFFFFF" />

        {/* Primary Aperture Group */}
        <group scale={scale}>
          <ApertureScene
            openTarget={openness}
            reducedMotion={reducedMotion}
            isLowEnd={isLowEnd}
            scrollProgressRef={scrollProgressRef}
          />
        </group>

        {/* Render controller for demand frameloops */}
        <ApertureController openness={openness} isDemand={frameloop === "demand"} />
      </Canvas>
    </div>
  );
}

export default React.memo(ApertureField);
