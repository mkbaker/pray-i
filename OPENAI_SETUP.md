# OpenAI Integration Setup

This document describes the OpenAI API integration for the PRAY-I application.

## Overview

The app integrates with OpenAI's API to generate contemplative prayer iterations. Two modes are supported:

1. **Production Mode**: Always uses real OpenAI API
2. **Development Mode**: Uses mock responses by default, with optional real API calls for testing

## Architecture

### Configuration Layer

- **`src/lib/config.ts`**: Manages environment-based configuration
  - Determines if app is in production or development
  - Checks dev mode toggle setting
  - Provides server-safe and client-safe config accessors

### Service Layer

- **`src/lib/prayerService.ts`**: Core prayer generation logic
  - `generatePrayer()`: Main entry point, routes to real or mock based on config
  - `generateRealPrayer()`: Calls OpenAI API to generate meditation iterations
  - `generateMockPrayer()`: Generates realistic-looking mock iterations

- **`src/lib/prayerClient.ts`**: Client-side API wrapper
  - `callPrayerApi()`: Fetches prayer from the API route

### API Layer

- **`src/app/api/prayer/route.ts`**: Next.js API route
  - Accepts POST requests with `prayerText` and `humanMinutes`
  - Returns `iterations`, `summary`, and `mode` ('real' or 'mock')

### UI Layer

- **`src/components/PrayerInProgress.tsx`**: Updated to use API
  - Calls `/api/prayer` when prayer session starts
  - Displays iterations progressively with visual timing
  - Shows mode indicator badge (AI Active / Mock Mode)
  - Handles errors gracefully

- **`src/components/DevModeIndicator.tsx`**: Dev mode UI
  - Shows current mode in bottom-right corner (dev only)
  - Provides instructions for toggling modes
  - Auto-hidden in production

## Environment Variables

### Required in Production

```bash
OPENAI_API_KEY=your_openai_api_key_here  # Required for production
```

### Optional in Development

```bash
# Set to 'true' to test with real AI in dev mode
NEXT_PUBLIC_DEV_MODE_USE_REAL_AI=false
```

## Mode Behavior

| Environment | `NEXT_PUBLIC_DEV_MODE_USE_REAL_AI` | Behavior            |
| ----------- | ---------------------------------- | ------------------- |
| Production  | (ignored)                          | Always uses real AI |
| Development | `false` or empty (default)         | Uses mock responses |
| Development | `true`                             | Uses real AI        |

## Testing

### Test Mock Mode (Default in Dev)

1. Run `npm run dev`
2. Submit a prayer
3. See mock iterations with "○ Mock Mode" badge
4. Check dev indicator in bottom-right

### Test Real AI in Dev Mode

1. Add your OpenAI API key to `.env.local`
2. Set `NEXT_PUBLIC_DEV_MODE_USE_REAL_AI=true` in `.env.local`
3. Restart the dev server
4. Submit a prayer
5. See real AI iterations with "● AI Active" badge

### Test Production Build

1. Set `OPENAI_API_KEY` in `.env.local`
2. Run `npm run build && npm start`
3. Submit a prayer
4. Real AI should be used (no dev indicator shown)

## Cost Considerations

- Each prayer request uses ~1-2k tokens (depending on length)
- Dev mode mock is completely free (no API calls)
- Enable real AI in dev mode only when testing integrations
- Production pricing: ~$0.01-0.03 per prayer (GPT-4 Turbo pricing)

## Troubleshooting

**"OpenAI API key not configured" error:**

- Ensure `OPENAI_API_KEY` is set in your environment
- Restart the server after changing environment variables

**Mock mode in production:**

- Check that `NODE_ENV=production` is set
- Verify API key is accessible in production environment

**Dev mode toggle not working:**

- Environment variables prefixed with `NEXT_PUBLIC_` need server restart
- Clear browser cache and reload
