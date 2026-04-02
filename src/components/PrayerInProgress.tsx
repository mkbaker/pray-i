"use client";

import { useEffect, useState } from "react";
import type { PrayerSessionState } from "@/app/page";
import { PrayerAnimation } from "./PrayerAnimation";
import { Card } from "./Card";
import { AnimatedText } from "./AnimatedText";
import { callPrayerApi } from "@/lib/prayerClient";

interface PrayerInProgressProps {
  session: PrayerSessionState;
  onUpdate: (lines: string[], summary?: string) => void;
  onComplete: () => void;
}

export function PrayerInProgress({
  session,
  onUpdate,
  onComplete,
}: PrayerInProgressProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"real" | "mock" | null>(null);

  useEffect(() => {
    // For UX, we cap actual on-screen duration to ~40s regardless of amount.
    const MAX_VISUAL_DURATION_MS = 40000;
    const MIN_VISUAL_DURATION_MS = 12000;

    const baseMs = session.metrics.humanMinutes * 1000; // 1 dollar ≈ 1 min ≈ 1s visual
    const targetDuration = Math.min(
      Math.max(baseMs, MIN_VISUAL_DURATION_MS),
      MAX_VISUAL_DURATION_MS,
    );

    let currentStep = 0;
    let timeoutId: number | undefined;
    let intervalId: number | undefined;
    let allIterations: string[] = [];
    let finalSummary = "";

    // Call the API to get prayer iterations
    const fetchPrayer = async () => {
      try {
        const response = await callPrayerApi({
          prayerText: session.prayerText,
          humanMinutes: session.metrics.humanMinutes,
        });

        allIterations = response.iterations;
        finalSummary = response.summary;
        setMode(response.mode);

        // Now display them progressively
        const totalSteps = allIterations.length;
        const intervalMs = targetDuration / totalSteps;
        const displayedLines: string[] = [];

        intervalId = window.setInterval(() => {
          currentStep += 1;
          const pct = Math.min(
            100,
            Math.round((currentStep / totalSteps) * 100),
          );
          setProgress(pct);

          if (currentStep <= totalSteps) {
            displayedLines.push(allIterations[currentStep - 1]);
            setLines([...displayedLines]);
            onUpdate([...displayedLines]);
          }

          if (currentStep >= totalSteps) {
            window.clearInterval(intervalId);
            onUpdate(displayedLines, finalSummary);
            setFinishing(true);
            // Allow the sphere to expand to fill the viewport before moving on.
            timeoutId = window.setTimeout(() => {
              onComplete();
            }, 1200);
          }
        }, intervalMs);
      } catch (err) {
        console.error("Failed to fetch prayer:", err);
        setError(
          err instanceof Error ? err.message : "Failed to generate prayer",
        );
      }
    };

    fetchPrayer();

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
    // Intentionally exclude onUpdate/onComplete from deps to avoid restarting
    // the interval whenever the parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.prayerText, session.metrics.humanMinutes]);

  return (
    <Card
      variant="panel"
      as="section"
      className="relative mt-10 flex min-h-[460px] flex-1 flex-col"
    >
      <PrayerAnimation progress={progress} finishing={finishing} />

      <div className="relative z-10 flex flex-1 flex-col justify-between px-8 py-8 sm:px-12 sm:py-10">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--pray-color-ink-55)]">
              PRAYER IN PROGRESS
            </p>
            {mode && (
              <span
                className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded ${
                  mode === "real"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {mode === "real" ? "● AI Active" : "○ Mock Mode"}
              </span>
            )}
          </div>
          <h2 className="max-w-xl text-2xl font-light leading-snug text-[color:var(--pray-color-ink-92)] sm:text-3xl">
            The agent is holding your request on your behalf.
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-[color:var(--pray-color-ink-70)]">
            Within this compressed window, the system repeats your intention
            many times over, letting silicon do the devotional labour in your
            place.
          </p>
        </div>

        <div className="mt-6 flex flex-1 flex-col gap-6 sm:flex-row">
          <div className="sm:w-2/5">
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[color:var(--pray-color-ink-12)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--pray-color-ink-85),var(--pray-color-ink-65))] transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--pray-color-ink-65)]">
              EST. REPETITIONS
            </p>
            <p className="mt-1 text-sm text-[color:var(--pray-color-ink-88)]">
              ≈ {Math.round(session.metrics.repetitions).toLocaleString()}{" "}
              silent recitations
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--pray-color-ink-70)]">
              You remain still. The machine does the repeating.
            </p>
          </div>

          <div className="sm:w-3/5">
            <Card
              variant="log"
              className="max-h-52 space-y-2 overflow-hidden text-[11px] leading-relaxed text-[color:var(--pray-color-ink-82)]"
            >
              {error ? (
                <p className="text-red-600">Error: {error}</p>
              ) : lines.length === 0 ? (
                <p className="italic text-[color:var(--pray-color-ink-60)]">
                  <AnimatedText
                    text="Settling into the first repetition…"
                    staggerDelay={0.035}
                  />
                </p>
              ) : (
                lines.map((line, idx) => (
                  <p key={idx}>
                    <AnimatedText text={line} staggerDelay={0.02} />
                  </p>
                ))
              )}
            </Card>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 text-[10px] text-[color:var(--pray-color-ink-60)]">
          <span>
            Est. human-equivalent minutes:{" "}
            {session.metrics.humanMinutes.toFixed(1)}
          </span>
          <span>
            Est. tokens processed:{" "}
            {Math.round(session.metrics.tokens).toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
}
