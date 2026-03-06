import type { CostMetrics } from "@/lib/costModel";
import { formatNumber } from "@/lib/costModel";

interface MetricsSummaryProps {
  metrics: CostMetrics;
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <div className="mt-6 rounded-2xl bg-[rgba(255,255,255,0.9)] p-4 text-xs leading-relaxed text-[rgba(0,0,0,0.8)] shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
      <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[rgba(0,0,0,0.6)]">
        ESTIMATED FOOTPRINT
      </p>
      <p>
        Your offering of <strong>${formatNumber(metrics.amountDollars, 2)}</strong> is
        translated into approximately <strong>{formatNumber(metrics.humanMinutes, 1)}</strong> minutes
        of human-equivalent contemplation, repeated about
        <strong> {Math.round(metrics.repetitions).toLocaleString()}</strong> times by the
        agent.
      </p>
      <p className="mt-2">
        In doing so, the system likely processes around
        <strong> {Math.round(metrics.tokens).toLocaleString()}</strong> tokens, drawing
        roughly <strong>{formatNumber(metrics.kWh, 4)}</strong> kWh of energy and
        consuming about <strong>{formatNumber(metrics.waterLiters, 3)}</strong> litres of
        cooling water.
      </p>
      <p className="mt-2">
        You save approximately <strong>{formatNumber(metrics.humanTimeSavedMinutes, 1)}</strong> minutes
        of your own time—outsourcing the repetition of your request to an
        indifferent yet attentive circuit.
      </p>
      <p className="mt-2 text-[10px] text-[rgba(0,0,0,0.6)]">
        All figures are rough estimates meant to gesture at the materiality of
        computation rather than precise accounting.
      </p>
    </div>
  );
}
