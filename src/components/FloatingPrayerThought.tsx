"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface FloatingPrayerThoughtProps {
  text: string;
  /** Center-coordinate offset from viewport center (px). Parent computes
   * this once at mount to avoid overlapping other visible thoughts. */
  initialX: number;
  initialY: number;
  onComplete: () => void;
}

export function FloatingPrayerThought({
  text,
  initialX,
  initialY,
  onComplete,
}: FloatingPrayerThoughtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const chars = el.querySelectorAll(".char");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1 });
      const tid = setTimeout(() => onCompleteRef.current(), 3000);
      return () => clearTimeout(tid);
    }

    // Offset from center so the element's visual center lands at (initialX, initialY).
    // The element is anchored at left:50%, top:50% (its top-left at viewport center);
    // GSAP x/y shift it from there.
    const startX = initialX - el.offsetWidth / 2;
    const startY = initialY - el.offsetHeight / 2;

    gsap.set(el, { x: startX, y: startY, opacity: 0, scale: 0.9 });
    gsap.set(chars, { opacity: 0, y: 5 });

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          if (!containerRef.current) return;
          const curY = (gsap.getProperty(el, "y") as number) || 0;

          const exitTl = gsap.timeline({
            onComplete: () => onCompleteRef.current(),
          });

          exitTl.to(chars, {
            opacity: 0,
            y: -20,
            duration: 0.8,
            stagger: 0.015,
            ease: "power2.in",
          });

          exitTl.to(
            el,
            { y: curY - 40, opacity: 0, duration: 1, ease: "power1.in" },
            0,
          );
        }, 3000);
      },
    });

    // Entrance
    tl.to(el, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
    tl.to(
      chars,
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.025, ease: "power2.out" },
      "-=0.2",
    );

    // Gentle drift while visible
    tl.to(
      el,
      {
        x: startX + (Math.random() - 0.5) * 40,
        y: startY + (Math.random() - 0.5) * 40,
        duration: 4,
        ease: "sine.inOut",
      },
      "-=0.2",
    );

    return () => {
      tl.kill();
    };
    // initialX/initialY are stable per-thought (computed once by parent at mount).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute max-w-sm"
      style={{ left: "50%", top: "50%", willChange: "transform, opacity" }}
    >
      <div className="rounded-xl border border-[color:var(--pray-color-ink-15)] bg-[color:var(--pray-color-white-90)] px-4 py-3 text-[13px] leading-relaxed text-[color:var(--pray-color-ink-80)] shadow-2xl backdrop-blur-md">
        {text.split("").map((char, idx) => (
          <span key={idx} className="char inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}
