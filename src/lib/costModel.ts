export interface CostMetrics {
  amountDollars: number;
  humanMinutes: number;
  repetitions: number;
  tokens: number;
  kWh: number;
  waterLiters: number;
  humanTimeSavedMinutes: number;
}

// Configurable constants for the artful cost model.
// These are intentionally approximate and documented as such.
const DOLLARS_PER_HUMAN_MINUTE = 1; // $1 ≈ 1 minute of human-equivalent prayer
const AGENT_SPEEDUP_FACTOR = 100; // 1 human minute ≈ 100 AI repetitions
const TOKENS_PER_REPETITION = 512; // combined prompt + internal workings
const KWH_PER_1K_TOKENS = 0.0005; // configurable estimate
const LITERS_WATER_PER_KWH = 0.5; // configurable estimate

export function computeCostMetrics(amountDollars: number): CostMetrics {
  const safeAmount = Math.max(0, amountDollars || 0);

  const humanMinutes = safeAmount * DOLLARS_PER_HUMAN_MINUTE;
  const repetitions = humanMinutes * AGENT_SPEEDUP_FACTOR;
  const tokens = repetitions * TOKENS_PER_REPETITION;
  const kWh = (tokens / 1000) * KWH_PER_1K_TOKENS;
  const waterLiters = kWh * LITERS_WATER_PER_KWH;
  const humanTimeSavedMinutes = humanMinutes;

  return {
    amountDollars: safeAmount,
    humanMinutes,
    repetitions,
    tokens,
    kWh,
    waterLiters,
    humanTimeSavedMinutes,
  };
}

export function formatNumber(value: number, fractionDigits = 1): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
