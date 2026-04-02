/**
 * API Route: Generate Prayer
 *
 * POST /api/prayer
 * Body: { prayerText: string, humanMinutes: number }
 * Returns: { iterations: string[], summary: string, mode: 'real' | 'mock' }
 */

import { NextRequest, NextResponse } from "next/server";
import { generatePrayer } from "@/lib/prayerService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prayerText, humanMinutes } = body;

    // Validate input
    if (!prayerText || typeof prayerText !== "string") {
      return NextResponse.json(
        { error: "prayerText is required and must be a string" },
        { status: 400 },
      );
    }

    if (!humanMinutes || typeof humanMinutes !== "number") {
      return NextResponse.json(
        { error: "humanMinutes is required and must be a number" },
        { status: 400 },
      );
    }

    // Generate prayer (will use real or mock based on config)
    const result = await generatePrayer({
      prayerText,
      humanMinutes,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Prayer API error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate prayer",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
