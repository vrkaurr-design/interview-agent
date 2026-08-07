"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ reducedMotion }: { reducedMotion: boolean }) {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 250;

    // Initialize random particle positions in a viewport distribution
    const positions = React.useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            pos[i] = (Math.random() - 0.5) * 16;     // X
            pos[i + 1] = (Math.random() - 0.5) * 16; // Y
            pos[i + 2] = (Math.random() - 0.5) * 10; // Z
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (!pointsRef.current || reducedMotion) return;

        // Slow, soothing drifting rotations
        const time = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = time * 0.02;
        pointsRef.current.rotation.x = time * 0.01;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#3ED9C8" // Cyan Accent to drift gently
                size={0.07}
                sizeAttenuation={true}
                transparent={true}
                opacity={0.25}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function Background3D() {
    const [reducedMotion, setReducedMotion] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Respect system reduced motion preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
            setReducedMotion(e.matches);
        };
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.4} />
                <Particles reducedMotion={reducedMotion} />
            </Canvas>
        </div>
    );
}
