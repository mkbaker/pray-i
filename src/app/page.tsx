"use client";

import { useState } from "react";
import { computeCostMetrics, type CostMetrics } from "@/lib/costModel";
import { LandingShell } from "@/components/LandingShell";
import { HeaderBar } from "@/components/HeaderBar";
import { HeroSection } from "@/components/HeroSection";
import { PrayerForm } from "@/components/PrayerForm";
import { PrayerInProgress } from "@/components/PrayerInProgress";
import { CertificateOfPrayer } from "@/components/CertificateOfPrayer";

export type Step = "form" | "praying" | "certificate";

export interface PrayerSessionState {
  prayerText: string;
  amountDollars: number;
  metrics: CostMetrics;
  agentLines: string[];
  summary: string; // paraphrased summary for certificate
}

export default function HomePage() {
  const [step, setStep] = useState<Step>("form");
  const [session, setSession] = useState<PrayerSessionState | null>(null);

  const handleStartPrayer = (prayerText: string, amountDollars: number) => {
    const metrics = computeCostMetrics(amountDollars);

    const initialSession: PrayerSessionState = {
      prayerText,
      amountDollars,
      metrics,
      agentLines: [],
      summary: "",
    };

    setSession(initialSession);
    setStep("praying");
  };

  const handlePrayerProgressUpdate = (lines: string[], summary?: string) => {
    setSession((prev) =>
      prev
        ? {
            ...prev,
            agentLines: lines,
            summary: summary ?? prev.summary,
          }
        : prev,
    );
  };

  const handlePrayerComplete = () => {
    setStep("certificate");
  };

  const handleRestart = () => {
    setSession(null);
    setStep("form");
  };

  return (
    <LandingShell>
      <HeaderBar />

      {step === "form" && (
        <>
          <HeroSection />
          <PrayerForm onStartPrayer={handleStartPrayer} />
        </>
      )}

      {step === "praying" && session && (
        <PrayerInProgress
          session={session}
          onUpdate={handlePrayerProgressUpdate}
          onComplete={handlePrayerComplete}
        />
      )}

      {step === "certificate" && session && (
        <CertificateOfPrayer session={session} onRestart={handleRestart} />
      )}
    </LandingShell>
  );
}
