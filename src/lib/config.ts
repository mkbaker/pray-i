/**
 * Application configuration for dev vs. production modes
 */

export interface AppConfig {
  isProduction: boolean;
  isDevelopment: boolean;
  useRealAI: boolean;
  openaiApiKey: string | undefined;
}

/**
 * Get the current app configuration
 *
 * In production: Always use real AI
 * In development: Use mock by default, but can toggle with NEXT_PUBLIC_DEV_MODE_USE_REAL_AI
 */
export function getConfig(): AppConfig {
  const nodeEnv = process.env.NODE_ENV || "development";
  const isProduction = nodeEnv === "production";
  const isDevelopment = !isProduction;

  // In production, always use real AI
  // In development, check the toggle flag
  const devModeToggle = process.env.NEXT_PUBLIC_DEV_MODE_USE_REAL_AI === "true";
  const useRealAI = isProduction || devModeToggle;

  const openaiApiKey = process.env.OPENAI_API_KEY;

  return {
    isProduction,
    isDevelopment,
    useRealAI,
    openaiApiKey,
  };
}

/**
 * Client-safe config (no API keys)
 */
export function getClientConfig() {
  const nodeEnv = process.env.NODE_ENV || "development";
  const isProduction = nodeEnv === "production";
  const isDevelopment = !isProduction;

  const devModeToggle = process.env.NEXT_PUBLIC_DEV_MODE_USE_REAL_AI === "true";
  const useRealAI = isProduction || devModeToggle;

  return {
    isProduction,
    isDevelopment,
    useRealAI,
  };
}
