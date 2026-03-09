"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PrayerAnimationProps {
  progress: number;
  finishing: boolean;
}

export function PrayerAnimation({ progress, finishing }: PrayerAnimationProps) {
  const clothBackRef = useRef<HTMLDivElement | null>(null);
  const clothFrontRef = useRef<HTMLDivElement | null>(null);
  const sphereRef = useRef<HTMLDivElement | null>(null);

  // Flowing cloth layers (unchanged, just motion in the background)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const back = clothBackRef.current;
    const front = clothFrontRef.current;

    if (!back || !front) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(back, {
      duration: 18,
      xPercent: 10,
      yPercent: -6,
      skewX: 6,
      borderRadius: "55% 45% 60% 40%",
      ease: "sine.inOut",
    }).to(
      back,
      {
        duration: 18,
        xPercent: -12,
        yPercent: 8,
        skewX: -8,
        borderRadius: "40% 60% 45% 55%",
        ease: "sine.inOut",
      },
      "+=0",
    );

    const tlFront = gsap.timeline({ repeat: -1, yoyo: true });

    tlFront.to(front, {
      duration: 16,
      xPercent: -8,
      yPercent: 4,
      skewY: -5,
      borderRadius: "60% 40% 50% 50%",
      ease: "sine.inOut",
    }).to(
      front,
      {
        duration: 16,
        xPercent: 6,
        yPercent: -6,
        skewY: 7,
        borderRadius: "45% 55% 60% 40%",
        ease: "sine.inOut",
      },
      "+=0",
    );

    return () => {
      tl.kill();
      tlFront.kill();
    };
  }, []);

  // Growing sphere of light driven by progress
  useEffect(() => {
    const sphere = sphereRef.current;
    if (!sphere) return;

    const clamped = Math.max(0, Math.min(progress, 100));
    const t = clamped / 100; // 0 → 1

    const baseScale = 0.6;
    const maxScale = 3.0; // fills most of the card at completion
    const scale = baseScale + (maxScale - baseScale) * t;

    const baseOpacity = 0.5;
    const maxOpacity = 1.0;
    const opacity = baseOpacity + (maxOpacity - baseOpacity) * t;

    gsap.to(sphere, {
      scale,
      opacity,
      duration: 0.8,
      ease: "sine.out",
    });
  }, [progress]);

  // When finishing, briefly expand the sphere to fill the viewport/card
  useEffect(() => {
    if (!finishing) return;
    const sphere = sphereRef.current;
    if (!sphere) return;

    gsap.to(sphere, {
      scale: 8, // effectively fills the viewport
      opacity: 1,
      duration: 1.0,
      ease: "sine.inOut",
    });
  }, [finishing]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Flowing cloth back layer */}
      <div
        ref={clothBackRef}
        className="absolute -inset-[10%] bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.9),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(244,220,190,0.75),transparent_58%),radial-gradient(circle_at_50%_100%,rgba(214,198,255,0.7),transparent_60%)] opacity-80 mix-blend-screen"
      />

      {/* Flowing cloth front layer */}
      <div
        ref={clothFrontRef}
        className="absolute -inset-[20%] bg-[radial-gradient(circle_at_0%_50%,rgba(255,255,255,0.9),transparent_55%),radial-gradient(circle_at_100%_40%,rgba(246,232,210,0.78),transparent_60%)] opacity-75 mix-blend-screen"
      />

      {/* Growing sphere of light */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={sphereRef}
          className="sphere-light h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(254,243,199,1)_30%,rgba(251,191,36,0.95)_55%,rgba(251,191,36,0.2)_75%,transparent_90%)] opacity-80 shadow-[0_0_160px_80px_rgba(255,255,255,0.95)]"
        >
          <div className="sphere-core h-full w-full rounded-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.95),rgba(255,255,255,0)_55%)] mix-blend-screen" />
        </div>
      </div>
    </div>
  );
}
