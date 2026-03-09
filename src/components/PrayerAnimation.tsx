"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface PrayerAnimationProps {
  progress: number;
  finishing: boolean;
}

export function PrayerAnimation({ progress, finishing }: PrayerAnimationProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const clothBackRef = useRef<HTMLDivElement | null>(null);
  const clothFrontRef = useRef<HTMLDivElement | null>(null);
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      prefersReducedMotionRef.current = media.matches;
    };

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => {
      media.removeEventListener("change", updatePreference);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const back = clothBackRef.current;
    const front = clothFrontRef.current;
    const sphere = sphereRef.current;

    if (!root || !back || !front || !sphere) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(sphere, { transformOrigin: "50% 50%", scale: 0.6, opacity: 0.5 });

      if (prefersReducedMotionRef.current) {
        return;
      }

      const backTimeline = gsap.timeline({ repeat: -1, yoyo: true });
      backTimeline
        .to(back, {
          duration: 18,
          xPercent: 10,
          yPercent: -6,
          skewX: 6,
          borderRadius: "55% 45% 60% 40%",
          ease: "sine.inOut",
        })
        .to(
          back,
          {
            duration: 18,
            xPercent: -12,
            yPercent: 8,
            skewX: -8,
            borderRadius: "40% 60% 45% 55%",
            ease: "sine.inOut",
          },
          0,
        );

      const frontTimeline = gsap.timeline({ repeat: -1, yoyo: true });
      frontTimeline
        .to(front, {
          duration: 16,
          xPercent: -8,
          yPercent: 4,
          skewY: -5,
          borderRadius: "60% 40% 50% 50%",
          ease: "sine.inOut",
        })
        .to(
          front,
          {
            duration: 16,
            xPercent: 6,
            yPercent: -6,
            skewY: 7,
            borderRadius: "45% 55% 60% 40%",
            ease: "sine.inOut",
          },
          0,
        );
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  // Growing sphere of light driven by progress
  useEffect(() => {
    if (finishing) {
      return;
    }

    const sphere = sphereRef.current;
    if (!sphere) {
      return;
    }

    const clamped = Math.max(0, Math.min(progress, 100));
    const t = clamped / 100;
    const scale = 0.6 + (3 - 0.6) * t;
    const opacity = 0.5 + (1 - 0.5) * t;

    if (prefersReducedMotionRef.current) {
      gsap.set(sphere, { scale, opacity });
      return;
    }

    gsap.to(sphere, {
      scale,
      opacity,
      duration: 0.45,
      ease: "sine.out",
      overwrite: "auto",
    });
  }, [progress, finishing]);

  // When finishing, briefly expand the sphere to fill the viewport/card
  useEffect(() => {
    if (!finishing) {
      return;
    }

    const sphere = sphereRef.current;
    if (!sphere) {
      return;
    }

    gsap.killTweensOf(sphere);

    if (prefersReducedMotionRef.current) {
      gsap.set(sphere, { scale: 8, opacity: 1 });
      return;
    }

    gsap.to(sphere, {
      scale: 8,
      opacity: 1,
      duration: 1,
      ease: "sine.inOut",
      overwrite: "auto",
    });
  }, [finishing]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Flowing cloth back layer */}
      <div
        ref={clothBackRef}
        className="absolute -inset-[10%] bg-[radial-gradient(circle_at_10%_0%,var(--pray-color-white-90),transparent_55%),radial-gradient(circle_at_90%_100%,var(--pray-color-cloth-gold),transparent_58%),radial-gradient(circle_at_50%_100%,var(--pray-color-cloth-lavender),transparent_60%)] opacity-80 mix-blend-screen will-change-transform"
      />

      {/* Flowing cloth front layer */}
      <div
        ref={clothFrontRef}
        className="absolute -inset-[20%] bg-[radial-gradient(circle_at_0%_50%,var(--pray-color-white-90),transparent_55%),radial-gradient(circle_at_100%_40%,var(--pray-color-cloth-cream),transparent_60%)] opacity-75 mix-blend-screen will-change-transform"
      />

      {/* Growing sphere of light */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={sphereRef}
          className="sphere-light h-48 w-48 rounded-full bg-[radial-gradient(circle,var(--pray-color-white-100)_0%,var(--pray-color-sphere-core)_30%,var(--pray-color-sphere-amber)_55%,var(--pray-color-sphere-amber-fade)_75%,transparent_90%)] opacity-80 shadow-[0_0_160px_80px_var(--pray-color-white-95)] will-change-transform"
        >
          <div className="sphere-core h-full w-full rounded-full bg-[radial-gradient(circle_at_70%_80%,var(--pray-color-white-95),var(--pray-color-white-00)_55%)] mix-blend-screen" />
        </div>
      </div>
    </div>
  );
}
