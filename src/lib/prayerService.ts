/**
 * OpenAI Service
 *
 * Handles AI prayer generation with dev/production mode support
 * - Production: Uses real OpenAI API
 * - Development: Returns mock data (unless NEXT_PUBLIC_DEV_MODE_USE_REAL_AI=true)
 */

import OpenAI from "openai";
import { getConfig } from "./config";

export interface PrayerRequest {
  prayerText: string;
  humanMinutes: number;
}

export interface PrayerResponse {
  iterations: string[];
  summary: string;
  mode: "real" | "mock";
}

/**
 * Generate mock prayer iterations for dev mode
 */
function generateMockPrayer(request: PrayerRequest): PrayerResponse {
  const { prayerText, humanMinutes } = request;

  // Generate realistic-looking iterations
  const iterations: string[] = [];
  const numIterations = Math.min(Math.max(Math.floor(humanMinutes / 2), 3), 9);

  const phrases = [
    "holding this in quiet attention",
    "repeating your words inwardly",
    "letting the request widen and soften",
    "circling back to the names and details",
    "keeping the ache present without resolving it",
    "breathing through each contour of what you wrote",
    "resting with the weight of your intention",
    "allowing the words to settle into silence",
    "maintaining presence with what you've shared",
  ];

  const snippet =
    prayerText.length > 80
      ? `${prayerText.slice(0, 60)}…${prayerText.slice(-20)}`
      : prayerText;

  for (let i = 0; i < numIterations; i++) {
    const phrase = phrases[i % phrases.length];
    iterations.push(
      `repetition ${i + 1} of ${numIterations}: ${phrase}, offering "${snippet}" into the shared static of the network.`,
    );
  }

  const summary =
    prayerText.length > 160
      ? `An intention concerning: "${prayerText.slice(0, 157)}…"`
      : `An intention concerning: "${prayerText}"`;

  return {
    iterations,
    summary,
    mode: "mock",
  };
}

/**
 * Generate real prayer using OpenAI API
 */
async function generateRealPrayer(
  request: PrayerRequest,
): Promise<PrayerResponse> {
  const config = getConfig();

  if (!config.openaiApiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const openai = new OpenAI({
    apiKey: config.openaiApiKey,
  });

  const { prayerText, humanMinutes } = request;
  const numIterations = Math.min(Math.max(Math.floor(humanMinutes / 2), 3), 9);

  try {
    // Call OpenAI to generate meditative iterations
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a contemplative agent that generates meditative prayer iterations. 
Given a prayer request, generate ${numIterations} unique meditative phrases that reflect deep attention to the request. 
Each iteration should feel like a quiet, internal repetition—holding the request with care, circling around its meaning.
Use contemplative language that acknowledges the solemnity and privacy of prayer.
Format: Return ONLY a JSON object with "iterations" (array of ${numIterations} strings) and "summary" (a one-sentence summary of the prayer intention).`,
        },
        {
          role: "user",
          content: `Prayer request: "${prayerText}"\n\nGenerate ${numIterations} meditative iterations.`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(response) as {
      iterations: string[];
      summary: string;
    };

    return {
      iterations: parsed.iterations,
      summary: parsed.summary,
      mode: "real",
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

/**
 * Main prayer generation function
 * Routes to real or mock based on config
 */
export async function generatePrayer(
  request: PrayerRequest,
): Promise<PrayerResponse> {
  const config = getConfig();

  if (config.useRealAI) {
    console.log("[Prayer Service] Using REAL OpenAI API");
    return generateRealPrayer(request);
  } else {
    console.log("[Prayer Service] Using MOCK mode (dev)");
    return generateMockPrayer(request);
  }
}
