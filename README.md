# Online Outfitters

A phone-first web app that suggests 1–3 outfits from clothes you already logged, for today’s weather, the occasion, and your taste.

No accounts. Your closet, photos, and saved looks stay in this browser.

## Run locally

You need Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:43147](http://localhost:43147) on your phone (same Wi‑Fi) or in a narrow browser window.

## How to use it

1. Tap **Let’s set you up**.
2. Enter your home city (for weather), pick colors you like, and how you dress.
3. Add at least five pieces with a photo and a few tags.
4. On Home, tap an occasion — Casual, Work, Nice out, or Workout.
5. Save a look if you like it. Saved looks live under **You**.

If weather can’t load, suggestions still run using your usual season.

## What’s stored where

- Closet photos and tags: IndexedDB in this browser
- Taste, city, and saved looks: localStorage
- Weather: [Open-Meteo](https://open-meteo.com) via `/api/weather` (no API key)

Clearing site data for this origin wipes the closet.
