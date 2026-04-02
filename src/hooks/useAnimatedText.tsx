import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface UseAnimatedTextOptions {
  staggerDelay?: number;
  entranceDuration?: number;
  exitDuration?: number;
  autoExitDelay?: number; // Delay in ms before auto-exiting (0 = no auto-exit)
  onExitComplete?: () => void; // Callback when exit animation completes
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
    autoExitDelay = 0,
    onExitComplete,
  } = options;

  const containerRef = useRef<HTMLSpanElement>(null);
  const entranceTimeline = useRef<gsap.core.Timeline | null>(null);
  const exitTimeline = useRef<gsap.core.Timeline | null>(null);
  const onExitCompleteRef = useRef(onExitComplete);
  const hasScheduledExit = useRef(false);

  // Update callback ref when it changes
  useEffect(() => {
    onExitCompleteRef.current = onExitComplete;
  }, [onExitComplete]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Wait for next frame to ensure chars are in DOM
    const timeoutId = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const chars = containerRef.current.querySelectorAll(".char");
      if (chars.length === 0) return;

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        // Set final state immediately without animation
        gsap.set(chars, { opacity: 1 });
        return;
      }

      // Set initial state explicitly
      gsap.set(chars, { opacity: 0, y: 10 });

      // Create entrance animation timeline
      entranceTimeline.current = gsap.timeline();
      entranceTimeline.current.to(chars, {
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

      const chars = containerRef.current.querySelectorAll(".char");
      if (chars.length === 0) {
        resolve();
        return;
      }

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(chars, { opacity: 0 });
        resolve();
        return;
      }

      // Kill entrance animation if still running
      entranceTimeline.current?.kill();

      // Create exit animation: float up and fade
      exitTimeline.current = gsap.timeline({
        onComplete: resolve,
      });

      exitTimeline.current.to(chars, {
        opacity: 0,
        y: -30,
        duration: exitDuration,
        stagger: staggerDelay * 0.5, // Faster stagger on exit
        ease: "power2.in",
      });
    });
  };

  // Auto-exit after delay if specified (only runs once on mount)
  useEffect(() => {
    if (autoExitDelay <= 0 || hasScheduledExit.current) return;

    hasScheduledExit.current = true;
    const exitTimer = setTimeout(() => {
      triggerExit().then(() => {
        onExitCompleteRef.current?.();
      });
    }, autoExitDelay);

    return () => clearTimeout(exitTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Split text into individual character spans
  const renderText = () => {
    return text.split("").map((char, idx) => (
      <span key={idx} className="char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return {
    containerRef,
    renderText,
    triggerExit,
  };
}
