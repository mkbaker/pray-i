/**
 * Client-side API client for prayer generation
 */

import type { PrayerResponse } from "./prayerService";

export interface PrayerApiRequest {
  prayerText: string;
  humanMinutes: number;
  signal?: AbortSignal;
}

/**
 * Call the prayer API to generate iterations
 */
export async function callPrayerApi(
  request: PrayerApiRequest,
): Promise<PrayerResponse> {
  const { signal, ...body } = request;
  const response = await fetch("/api/prayer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}
