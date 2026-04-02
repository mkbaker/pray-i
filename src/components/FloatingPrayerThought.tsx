"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface FloatingPrayerThoughtProps {
  text: string;
  onComplete: () => void;
}

export function FloatingPrayerThought({
  text,
  onComplete,
}: FloatingPrayerThoughtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep the ref current without re-running the animation effect
  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const chars = container.querySelectorAll(".char");

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(container, { opacity: 1 });
      setTimeout(() => onCompleteRef.current(), 3000);
      return;
    }

    // Random positioning (avoid center where animation is)
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 150;
    const startX = Math.cos(angle) * distance;
    const startY = Math.sin(angle) * distance;

    // Initial position
    gsap.set(container, {
      x: startX,
      y: startY,
      opacity: 0,
      scale: 0.9,
    });

    gsap.set(chars, { opacity: 0, y: 5 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Exit after 3 seconds
        setTimeout(() => {
          const exitTl = gsap.timeline({
            onComplete: () => onCompleteRef.current(),
          });

          // Characters float up and fade
          exitTl.to(chars, {
            opacity: 0,
            y: -20,
            duration: 0.8,
            stagger: 0.015,
            ease: "power2.in",
          });

          // Container drifts up slowly
          exitTl.to(
            container,
            {
              y: startY - 40,
              opacity: 0,
              duration: 1,
              ease: "power1.in",
            },
            0,
          );
        }, 3000);
      },
    });

    // Entrance: Container fades in
    tl.to(container, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    // Characters appear letter by letter
    tl.to(
      chars,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.025,
        ease: "power2.out",
      },
      "-=0.2",
    );

    // Gentle drift animation while visible
    tl.to(
      container,
      {
        x: startX + (Math.random() - 0.5) * 30,
        y: startY + (Math.random() - 0.5) * 30,
        duration: 3,
        ease: "sine.inOut",
      },
      "-=0.3",
    );

    return () => {
      tl.kill();
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute left-1/2 top-1/2 max-w-sm"
      style={{
        willChange: "transform, opacity",
        transform: "translate(-50%, -50%)",
      }}
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
