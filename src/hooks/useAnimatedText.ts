import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface UseAnimatedTextOptions {
  staggerDelay?: number;
  entranceDuration?: number;
  exitDuration?: number;
}

/**
 * Hook for animating text with letter-by-letter entrance and floating exit
 * Follows GSAP best practices: cleanup, reduced motion, GPU-accelerated transforms
 */
export function useAnimatedText(
  text: string,
  options: UseAnimatedTextOptions = {},
) {
  const {
    staggerDelay = 0.03,
    entranceDuration = 0.4,
    exitDuration = 0.6,
  } = options;

  const containerRef = useRef<HTMLSpanElement>(null);
  const entranceTimeline = useRef<gsap.core.Timeline | null>(null);
  const exitTimeline = useRef<gsap.core.Timeline | null>(null);

  // Split text into individual characters
  const chars = text.split("").map((char) => (char === " " ? "\u00A0" : char));

  useEffect(() => {
    if (!containerRef.current) return;

    // Wait for next frame to ensure chars are in DOM
    const timeoutId = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const charElements = containerRef.current.querySelectorAll(".char");
      if (charElements.length === 0) return;

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        // Set final state immediately without animation
        gsap.set(charElements, { opacity: 1 });
        return;
      }

      // Set initial state explicitly
      gsap.set(charElements, { opacity: 0, y: 10 });

      // Create entrance animation timeline
      entranceTimeline.current = gsap.timeline();
      entranceTimeline.current.to(charElements, {
        opacity: 1,
        y: 0,
        duration: entranceDuration,
        stagger: staggerDelay,
        ease: "power2.out",
      });
    });

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(timeoutId);
      entranceTimeline.current?.kill();
      exitTimeline.current?.kill();
    };
  }, [text, staggerDelay, entranceDuration, exitDuration]);

  const triggerExit = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!containerRef.current) {
        resolve();
        return;
      }

      const charElements = containerRef.current.querySelectorAll(".char");
      if (charElements.length === 0) {
        resolve();
        return;
      }

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(charElements, { opacity: 0 });
        resolve();
        return;
      }

      // Kill entrance animation if still running
      entranceTimeline.current?.kill();

      // Create exit animation: float up and fade
      exitTimeline.current = gsap.timeline({
        onComplete: resolve,
      });

      exitTimeline.current.to(charElements, {
        opacity: 0,
        y: -30,
        duration: exitDuration,
        stagger: staggerDelay * 0.5, // Faster stagger on exit
        ease: "power2.in",
      });
    });
  };

  return {
    containerRef,
    chars,
    triggerExit,
  };
}
