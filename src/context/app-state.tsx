"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_PREFS } from "@/lib/constants";
import { suggestOutfits } from "@/lib/outfit";
import {
  deletePiece as deletePieceDb,
  loadPieces,
  loadPrefs,
  loadSavedLooks,
  putPiece,
  savePrefs,
  saveSavedLooks,
} from "@/lib/storage";
import {
  fetchWeather,
  weatherFromCacheOrFallback,
} from "@/lib/weather";
import type {
  Occasion,
  OutfitLook,
  Piece,
  Prefs,
  SavedLook,
  Screen,
  WeatherInfo,
} from "@/lib/types";

type AppState = {
  ready: boolean;
  prefs: Prefs;
  pieces: Piece[];
  savedLooks: SavedLook[];
  weather: WeatherInfo;
  screen: Screen;
  go: (screen: Screen) => void;
  updatePrefs: (patch: Partial<Prefs>) => void;
  savePiece: (piece: Piece) => Promise<void>;
  removePiece: (id: string) => Promise<void>;
  completeOnboarding: () => void;
  looksFor: (occasion: Occasion) => OutfitLook[];
  toggleSavedLook: (occasion: Occasion, look: OutfitLook) => void;
  isLookSaved: (look: OutfitLook) => boolean;
  removeSavedLook: (id: string) => void;
  savedLookById: (id: string) => SavedLook | undefined;
};

const Ctx = createContext<AppState | null>(null);

function looksEqual(a: OutfitLook, b: { items: { id: string }[] }): boolean {
  const left = a.items.map((i) => i.id).sort().join("+");
  const right = b.items.map((i) => i.id).sort().join("+");
  return left === right;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ ...DEFAULT_PREFS });
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>([]);
  const [weather, setWeather] = useState<WeatherInfo>(() =>
    weatherFromCacheOrFallback(""),
  );
  const [screen, setScreen] = useState<Screen>({ name: "welcome" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const nextPrefs = loadPrefs();
      const nextPieces = await loadPieces();
      const nextLooks = loadSavedLooks();
      if (cancelled) return;
      setPrefs(nextPrefs);
      setPieces(nextPieces);
      setSavedLooks(nextLooks);
      setWeather(weatherFromCacheOrFallback(nextPrefs.city));
      setScreen(
        nextPrefs.onboardingComplete
          ? { name: "home" }
          : { name: "welcome" },
      );
      setReady(true);
      if (nextPrefs.city.trim()) {
        const fresh = await fetchWeather(nextPrefs.city);
        if (!cancelled) setWeather(fresh);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    savePrefs(prefs);
  }, [prefs, ready]);

  useEffect(() => {
    if (!ready) return;
    saveSavedLooks(savedLooks);
  }, [savedLooks, ready]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const handle = window.setTimeout(() => {
      void (async () => {
        const next = await fetchWeather(prefs.city);
        if (!cancelled) setWeather(next);
      })();
    }, prefs.city.trim() ? 450 : 0);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [prefs.city, ready]);

  const go = useCallback((next: Screen) => {
    setScreen(next);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  const updatePrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefs((prev) => ({ ...prev, ...patch }));
  }, []);

  const savePiece = useCallback(async (piece: Piece) => {
    await putPiece(piece);
    setPieces((prev) => {
      const idx = prev.findIndex((p) => p.id === piece.id);
      if (idx === -1) return [...prev, piece];
      const copy = [...prev];
      copy[idx] = piece;
      return copy;
    });
  }, []);

  const removePiece = useCallback(async (id: string) => {
    await deletePieceDb(id);
    setPieces((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const completeOnboarding = useCallback(() => {
    setPrefs((prev) => ({ ...prev, onboardingComplete: true }));
  }, []);

  const looksFor = useCallback(
    (occasion: Occasion): OutfitLook[] => {
      return suggestOutfits(pieces, prefs, occasion, weather.season);
    },
    [pieces, prefs, weather.season],
  );

  const isLookSaved = useCallback(
    (look: OutfitLook) => savedLooks.some((s) => looksEqual(look, s)),
    [savedLooks],
  );

  const toggleSavedLook = useCallback(
    (occasion: Occasion, look: OutfitLook) => {
      setSavedLooks((prev) => {
        const existing = prev.find((s) => looksEqual(look, s));
        if (existing) return prev.filter((s) => s.id !== existing.id);
        return [
          {
            id: crypto.randomUUID(),
            occasion,
            createdAt: Date.now(),
            why: look.why,
            items: look.items,
            missing: look.missing,
          },
          ...prev,
        ];
      });
    },
    [],
  );

  const removeSavedLook = useCallback((id: string) => {
    setSavedLooks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const savedLookById = useCallback(
    (id: string) => savedLooks.find((s) => s.id === id),
    [savedLooks],
  );

  const value = useMemo<AppState>(
    () => ({
      ready,
      prefs,
      pieces,
      savedLooks,
      weather,
      screen,
      go,
      updatePrefs,
      savePiece,
      removePiece,
      completeOnboarding,
      looksFor,
      toggleSavedLook,
      isLookSaved,
      removeSavedLook,
      savedLookById,
    }),
    [
      ready,
      prefs,
      pieces,
      savedLooks,
      weather,
      screen,
      go,
      updatePrefs,
      savePiece,
      removePiece,
      completeOnboarding,
      looksFor,
      toggleSavedLook,
      isLookSaved,
      removeSavedLook,
      savedLookById,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
