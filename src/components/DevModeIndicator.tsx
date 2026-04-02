/**
 * Dev Mode Indicator
 * Shows current mode and provides instructions for toggling in dev mode
 */

"use client";

import { useMemo } from "react";

export function DevModeIndicator() {
  // Compute config directly without state
  const config = useMemo(() => {
    const isDevelopment = process.env.NODE_ENV === "development";
    const useRealAI = process.env.NEXT_PUBLIC_DEV_MODE_USE_REAL_AI === "true";
    return { isDevelopment, useRealAI };
  }, []);

  // Only show in development mode
  if (!config.isDevelopment) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="rounded-lg border border-gray-300 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
            Dev Mode
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium ${
              config.useRealAI
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {config.useRealAI ? (
              <>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                Real AI
              </>
            ) : (
              <>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                Mock Mode
              </>
            )}
          </span>
        </div>
        <div className="mt-2 text-[10px] leading-relaxed text-gray-600">
          {config.useRealAI ? (
            <p>
              Using real OpenAI API.
              <br />
              To disable: Set{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[9px]">
                NEXT_PUBLIC_DEV_MODE_USE_REAL_AI=false
              </code>
            </p>
          ) : (
            <p>
              Using mock responses.
              <br />
              To test with real AI: Set{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[9px]">
                NEXT_PUBLIC_DEV_MODE_USE_REAL_AI=true
              </code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
