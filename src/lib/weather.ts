import type { WeatherInfo, WeatherSeason } from "./types";

const CACHE_KEY = "oo.v1.weather-cache";
const CACHE_MS = 30 * 60 * 1000;

type CacheRow = {
  city: string;
  fetchedAt: number;
  displayName: string;
  tempF: number;
  description: string;
};

export function usualSeason(now = new Date()): WeatherSeason {
  const month = now.getMonth() + 1;
  if (month >= 5 && month <= 9) return "warm";
  if (month === 4 || month === 10) return "mild";
  return "cool";
}

function describeCode(code: number): string {
  if (code === 0) return "sunny";
  if (code <= 2) return "partly cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "foggy";
  if (code >= 51 && code <= 67) return "rainy";
  if (code >= 71 && code <= 77) return "snowy";
  if (code >= 80 && code <= 82) return "rainy";
  if (code >= 85 && code <= 86) return "snowy";
  if (code >= 95) return "stormy";
  return "cloudy";
}

function seasonFromTemp(tempF: number): WeatherSeason {
  if (tempF >= 68) return "warm";
  if (tempF <= 52) return "cool";
  return "mild";
}

function readCache(city: string): CacheRow | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const row = JSON.parse(raw) as CacheRow;
    if (row.city.trim().toLowerCase() !== city.trim().toLowerCase()) return null;
    if (Date.now() - row.fetchedAt > CACHE_MS) return null;
    return row;
  } catch {
    return null;
  }
}

function writeCache(row: CacheRow): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(row));
}

export function weatherFromCacheOrFallback(city: string): WeatherInfo {
  const season = usualSeason();
  if (!city.trim()) {
    return { status: "no-city", season, line: "Set your city for weather" };
  }
  const cached = readCache(city);
  if (cached) {
    return {
      status: "ok",
      displayName: cached.displayName,
      tempF: cached.tempF,
      description: cached.description,
      season: seasonFromTemp(cached.tempF),
      line: `${cached.displayName} · ${cached.tempF}° and ${cached.description}`,
    };
  }
  return {
    status: "unavailable",
    season,
    line: city.trim(),
  };
}

export async function fetchWeather(city: string): Promise<WeatherInfo> {
  const season = usualSeason();
  if (!city.trim()) {
    return { status: "no-city", season, line: "Set your city for weather" };
  }

  const cached = readCache(city);
  if (cached) {
    return weatherFromCacheOrFallback(city);
  }

  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
      return {
        status: "unavailable",
        season,
        line: "Weather unavailable — using your usual season.",
      };
    }
    const data = (await res.json()) as {
      displayName: string;
      tempF: number;
      code: number;
    };
    const description = describeCode(data.code);
    writeCache({
      city,
      fetchedAt: Date.now(),
      displayName: data.displayName,
      tempF: data.tempF,
      description,
    });
    return {
      status: "ok",
      displayName: data.displayName,
      tempF: data.tempF,
      description,
      season: seasonFromTemp(data.tempF),
      line: `${data.displayName} · ${data.tempF}° and ${description}`,
    };
  } catch {
    return {
      status: "unavailable",
      season,
      line: "Weather unavailable — using your usual season.",
    };
  }
}
