import type { CostMetrics } from "@/lib/costModel";
import { formatNumber } from "@/lib/costModel";
import { Card } from "./Card";

interface MetricsSummaryProps {
  metrics: CostMetrics;
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <Card
      variant="metrics"
      className="mt-6 text-xs leading-relaxed text-[color:var(--pray-color-ink-80)]"
    >
      <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[color:var(--pray-color-ink-60)]">
        ESTIMATED FOOTPRINT
      </p>
      <p>
        Your offering of{" "}
        <strong>${formatNumber(metrics.amountDollars, 2)}</strong> is translated
        into approximately{" "}
        <strong>{formatNumber(metrics.humanMinutes, 1)}</strong> minutes of
        human-equivalent contemplation, repeated about
        <strong>
          {" "}
          {Math.round(metrics.repetitions).toLocaleString()}
        </strong>{" "}
        times by the agent.
      </p>
      <p className="mt-2">
        In doing so, the system likely processes around
        <strong> {Math.round(metrics.tokens).toLocaleString()}</strong> tokens,
        drawing roughly <strong>{formatNumber(metrics.kWh, 4)}</strong> kWh of
        energy and consuming about{" "}
        <strong>{formatNumber(metrics.waterLiters, 3)}</strong> litres of
        cooling water.
      </p>
      <p className="mt-2">
        You save approximately{" "}
        <strong>{formatNumber(metrics.humanTimeSavedMinutes, 1)}</strong>{" "}
        minutes of your own time—outsourcing the repetition of your request to
        an indifferent yet attentive circuit.
      </p>
      <p className="mt-2 text-[10px] text-[color:var(--pray-color-ink-60)]">
        All figures are rough estimates meant to gesture at the materiality of
        computation rather than precise accounting.
      </p>
    </Card>
  );
}
