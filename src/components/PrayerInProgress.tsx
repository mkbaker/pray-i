"use client";

import { useEffect, useState } from "react";
import type { PrayerSessionState } from "@/app/page";
import { PrayerAnimation } from "./PrayerAnimation";

interface PrayerInProgressProps {
  session: PrayerSessionState;
  onUpdate: (lines: string[], summary?: string) => void;
  onComplete: () => void;
}

// A small pool of phrases to assemble meditative lines from.
const INVOCATIONS = [
  "holding this in quiet attention",
  "repeating your words inwardly",
  "letting the request widen and soften",
  "circling back to the names and details",
  "keeping the ache present without resolving it",
  "breathing through each contour of what you wrote",
];

const ADDRESS = [
  "toward the empty space between words",
  "into the indifferent circuitry",
  "before whatever listens without a face",
  "into the shared static of the network",
];

function generateLine(iteration: number, total: number, snippet: string): string {
  const inv = INVOCATIONS[iteration % INVOCATIONS.length];
  const addr = ADDRESS[iteration % ADDRESS.length];

  return `repetition ${iteration + 1} of ${total}: ${inv}, offering "${snippet}" ${addr}.`;
}

function createSummary(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "A private intention entrusted in silence.";

  // Take a short slice and frame it.
  const slice = trimmed.length > 160 ? `${trimmed.slice(0, 157)}…` : trimmed;
  return `An intention concerning: "${slice}"`;
}

export function PrayerInProgress({
  session,
  onUpdate,
  onComplete,
}: PrayerInProgressProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // For UX, we cap actual on-screen duration to ~40s regardless of amount.
    const MAX_VISUAL_DURATION_MS = 40000;
    const MIN_VISUAL_DURATION_MS = 12000;

    const baseMs = session.metrics.humanMinutes * 1000; // 1 dollar ≈ 1 min ≈ 1s visual
    const targetDuration = Math.min(
      Math.max(baseMs, MIN_VISUAL_DURATION_MS),
      MAX_VISUAL_DURATION_MS,
    );

    const totalSteps = 9;
    const intervalMs = targetDuration / totalSteps;

    const text = session.prayerText;
    const snippet =
      text.length > 80 ? `${text.slice(0, 60)}…${text.slice(-20)}` : text;

    let currentStep = 0;
    const newLines: string[] = [];

    const intervalId = window.setInterval(() => {
      currentStep += 1;
      const pct = Math.min(100, Math.round((currentStep / totalSteps) * 100));
      setProgress(pct);

      if (currentStep <= totalSteps - 1) {
        const line = generateLine(currentStep - 1, totalSteps - 1, snippet);
        newLines.push(line);
        setLines([...newLines]);
        onUpdate([...newLines]);
      }

      if (currentStep >= totalSteps) {
        window.clearInterval(intervalId);
        const summary = createSummary(text);
        onUpdate(newLines, summary);
        onComplete();
      }
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
    // We intentionally exclude onUpdate/onComplete from deps to avoid
    // restarting the interval on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.prayerText, session.metrics.humanMinutes]);

  return (
    <section className="relative mt-10 flex min-h-[460px] flex-1 flex-col overflow-hidden rounded-3xl bg-[rgba(248,242,234,0.96)] shadow-[0_28px_70px_rgba(0,0,0,0.18)]">
      <PrayerAnimation />

      <div className="relative z-10 flex flex-1 flex-col justify-between px-8 py-8 sm:px-12 sm:py-10">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.55)]">
            PRAYER IN PROGRESS
          </p>
          <h2 className="max-w-xl text-2xl font-light leading-snug text-[rgba(0,0,0,0.92)] sm:text-3xl">
            The agent is holding your request on your behalf.
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-[rgba(0,0,0,0.7)]">
            Within this compressed window, the system repeats your intention
            many times over, letting silicon do the devotional labour in your
            place.
          </p>
        </div>

        <div className="mt-6 flex flex-1 flex-col gap-6 sm:flex-row">
          <div className="sm:w-2/5">
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.12)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(0,0,0,0.85),rgba(0,0,0,0.65))] transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[rgba(0,0,0,0.65)]">
              EST. REPETITIONS
            </p>
            <p className="mt-1 text-sm text-[rgba(0,0,0,0.88)]">
              ≈ {Math.round(session.metrics.repetitions).toLocaleString()} silent
              recitations
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-[rgba(0,0,0,0.7)]">
              You remain still. The machine does the repeating.
            </p>
          </div>

          <div className="sm:w-3/5">
            <div className="max-h-52 space-y-2 overflow-hidden rounded-2xl bg-white/65 p-4 text-[11px] leading-relaxed text-[rgba(0,0,0,0.82)] shadow-[0_16px_40px_rgba(0,0,0,0.16)]">
              {lines.length === 0 && (
                <p className="italic text-[rgba(0,0,0,0.6)]">
                  Settling into the first repetition…
                </p>
              )}
              {lines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 text-[10px] text-[rgba(0,0,0,0.6)]">
          <span>
            Est. human-equivalent minutes: {session.metrics.humanMinutes.toFixed(1)}
          </span>
          <span>
            Est. tokens processed: {Math.round(session.metrics.tokens).toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
}
