"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function PrayerAnimation() {
  const clothRefBack = useRef<HTMLDivElement | null>(null);
  const clothRefFront = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const back = clothRefBack.current;
    const front = clothRefFront.current;
    const halo = haloRef.current;
    if (!back || !front || !halo) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(back, {
      duration: 20,
      xPercent: 8,
      yPercent: -6,
      skewY: 5,
      borderTopLeftRadius: "60% 80%",
      borderBottomRightRadius: "70% 90%",
      ease: "sine.inOut",
    }).to(
      back,
      {
        duration: 20,
        xPercent: -10,
        yPercent: 8,
        skewY: -4,
        borderTopLeftRadius: "80% 60%",
        borderBottomRightRadius: "60% 80%",
        ease: "sine.inOut",
      },
      "+=0",
    );

    gsap.to(front, {
      duration: 16,
      xPercent: -6,
      yPercent: 4,
      skewX: 4,
      borderBottomLeftRadius: "70% 90%",
      borderTopRightRadius: "60% 80%",
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.to(halo, {
      duration: 10,
      scale: 1.08,
      opacity: 0.9,
      xPercent: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tl.kill();
      gsap.killTweensOf(front);
      gsap.killTweensOf(halo);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        ref={clothRefBack}
        className="absolute -inset-6 bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.9),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(244,220,190,0.8),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(214,198,255,0.7),transparent_65%)] opacity-90 mix-blend-screen"
      />
      <div
        ref={clothRefFront}
        className="absolute inset-[-20%] bg-[radial-gradient(circle_at_0%_30%,rgba(255,255,255,0.95),transparent_55%),radial-gradient(circle_at_100%_70%,rgba(245,229,210,0.85),transparent_60%)] opacity-80 mix-blend-screen"
      />
      <div
        ref={haloRef}
        className="absolute inset-x-6 top-6 h-72 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,1),rgba(255,255,255,0)_70%)] opacity-80 blur-3xl mix-blend-screen"
      />
    </div>
  );
}
