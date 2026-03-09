"use client";

import { useState } from "react";

interface PrayerFormProps {
  onStartPrayer: (prayerText: string, amountDollars: number) => void;
}

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 100;

export function PrayerForm({ onStartPrayer }: PrayerFormProps) {
  const [prayer, setPrayer] = useState("");
  const [amount, setAmount] = useState<number>(10);
  const [optimize, setOptimize] = useState(false);
  const [touched, setTouched] = useState(false);

  const totalAmount = amount + (optimize ? 1 : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!prayer.trim()) return;
    if (totalAmount < MIN_AMOUNT) return;
    onStartPrayer(prayer.trim(), totalAmount);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const value = raw === "" ? 0 : Number(raw);
    if (Number.isNaN(value)) return;
    setAmount(value);
  };

  const amountError =
    touched && totalAmount < MIN_AMOUNT
      ? `Minimum offering is $${MIN_AMOUNT.toFixed(2)}`
      : "";

  return (
    <section className="mt-8">
      <form
        onSubmit={handleSubmit}
        className="grid gap-10 rounded-3xl bg-white/50 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] sm:p-10"
      >
        <div className="space-y-4">
          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-[rgba(0,0,0,0.5)]">
            Your request
            <textarea
              className="mt-3 h-40 w-full resize-none rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white/70 px-4 py-3 text-sm leading-relaxed text-[rgba(0,0,0,0.9)] shadow-inner outline-none ring-0 transition focus:border-[rgba(0,0,0,0.4)] focus:shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
              placeholder="Write as you would in private prayer. No one else will read this."
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              onBlur={() => setTouched(true)}
            />
          </label>
          <p className="text-[11px] leading-relaxed text-[rgba(0,0,0,0.6)]">
            The agent will repeat this request silently, adjusting its internal
            attention around your words. Nothing is stored after this session.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-[rgba(0,0,0,0.5)]">
                Offering
              </label>
              <div className="text-sm text-[rgba(0,0,0,0.75)]">
                <span className="text-xs uppercase tracking-[0.18em] text-[rgba(0,0,0,0.45)]">
                  EST. HUMAN MINUTES
                </span>
                <span className="ml-2 text-sm font-medium text-[rgba(0,0,0,0.8)]">
                  ≈ {totalAmount || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-[rgba(0,0,0,0.45)]">${MIN_AMOUNT}</span>
              <input
                type="range"
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                value={Math.min(Math.max(amount, MIN_AMOUNT), MAX_AMOUNT)}
                onChange={handleSliderChange}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[rgba(0,0,0,0.08)] accent-[rgba(0,0,0,0.85)] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[rgba(0,0,0,0.85)] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)]"
              />
              <span className="text-xs text-[rgba(0,0,0,0.45)]">${MAX_AMOUNT}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-baseline rounded-full bg-[rgba(255,255,255,0.9)] px-3 py-1 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.07)]">
                <span className="text-xs text-[rgba(0,0,0,0.45)]">USD</span>
                <span className="ml-1 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  className="w-20 border-none bg-transparent pl-1 text-sm text-[rgba(0,0,0,0.9)] outline-none"
                  value={amount === 0 ? "" : amount.toString()}
                  onChange={handleAmountInput}
                />
              </div>
              <p className="text-[10px] leading-snug text-[rgba(0,0,0,0.55)]">
                Your offering approximates the literal compute cost: more dollars
                mean more repetitions of your request within a short machine
                window.
              </p>
            </div>

            <label className="mt-2 flex cursor-pointer items-start gap-2 rounded-2xl bg-[rgba(255,255,255,0.8)] px-3 py-2 text-[11px] leading-snug text-[rgba(0,0,0,0.75)] shadow-[0_10px_26px_rgba(0,0,0,0.08)]">
              <input
                type="checkbox"
                className="mt-[2px] h-3.5 w-3.5 rounded border border-[rgba(0,0,0,0.4)] accent-[rgba(0,0,0,0.9)]"
                checked={optimize}
                onChange={(e) => setOptimize(e.target.checked)}
              />
              <span>
                Optimize this prayer for an additional <strong>$1</strong>. The agent
                will devote a small extra burst of tuned attention to patterning
                and repetition.
              </span>
            </label>

            {optimize && (
              <p className="mt-1 text-[10px] text-[rgba(0,0,0,0.6)]">
                Includes +1 minute for machine optimization.
              </p>
            )}

            {amountError && (
              <p className="mt-1 text-[11px] text-[rgba(160,61,44,0.9)]">
                {amountError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[rgba(0,0,0,0.92)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60"
            >
              Begin delegated prayer
            </button>
            <p className="text-center text-[10px] text-[rgba(0,0,0,0.6)]">
              Total estimated charge: ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </form>
    </section>
  );
}
