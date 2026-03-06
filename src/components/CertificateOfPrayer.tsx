"use client";

import { useMemo } from "react";
import type { PrayerSessionState } from "@/app/page";
import { MetricsSummary } from "./MetricsSummary";

interface CertificateOfPrayerProps {
  session: PrayerSessionState;
  onRestart: () => void;
}

export function CertificateOfPrayer({
  session,
  onRestart,
}: CertificateOfPrayerProps) {
  const dateString = useMemo(() => {
    return new Date().toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, []);

  return (
    <section className="mt-10 flex flex-1 flex-col items-center justify-center">
      <div className="w-full max-w-3xl rounded-[32px] bg-[rgba(252,249,244,0.96)] px-6 py-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.22)] sm:px-10 sm:py-10">
        <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.55)]">
          CERTIFICATE OF PRAYER
        </div>
        <h2 className="text-3xl font-light leading-tight text-[rgba(0,0,0,0.94)] sm:text-4xl">
          This request has been held.
        </h2>

        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[rgba(0,0,0,0.55)]">
          ISSUED {dateString.toUpperCase()}
        </p>

        <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white/80 p-5 text-left text-sm leading-relaxed text-[rgba(0,0,0,0.86)] shadow-[0_14px_40px_rgba(0,0,0,0.14)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[rgba(0,0,0,0.6)]">
            PARAPHRASED INTENTION
          </p>
          <p className="mt-2">
            {session.summary || "An intention entrusted without further description."}
          </p>

          <p className="mt-4 text-[11px] leading-relaxed text-[rgba(0,0,0,0.72)]">
            On this date, your request was delegated to the Prayer Agent for an
            interval of concentrated machine attention. Within that span, the
            system silently repeated and reframed your words on your behalf.
          </p>
        </div>

        <MetricsSummary metrics={session.metrics} />

        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(0,0,0,0.3)] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[rgba(0,0,0,0.9)] transition hover:bg-[rgba(0,0,0,0.04)]"
          >
            Print / Save Certificate
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center rounded-full bg-[rgba(0,0,0,0.92)] px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_16px_40px_rgba(0,0,0,0.3)] transition hover:bg-black"
          >
            Offer another request
          </button>
        </div>

        <p className="mt-4 text-[10px] text-[rgba(0,0,0,0.55)]">
          No copy of your words is kept beyond this page. Closing this window
          releases the system from remembering them.
        </p>
      </div>
    </section>
  );
}
