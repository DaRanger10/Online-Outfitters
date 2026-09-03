import { DEFAULT_PREFS } from "./constants";
import type { Piece, Prefs, SavedLook } from "./types";

const PREFS_KEY = "oo.v1.prefs";
const LOOKS_KEY = "oo.v1.looks";
const DB_NAME = "online-outfitters";
const DB_VERSION = 1;
const PIECES_STORE = "pieces";

function canUseBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadPrefs(): Prefs {
  if (!canUseBrowser()) return { ...DEFAULT_PREFS };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return {
      city: typeof parsed.city === "string" ? parsed.city : "",
      colors: Array.isArray(parsed.colors) ? parsed.colors : [],
      mixItUp: Boolean(parsed.mixItUp),
      vibe:
        parsed.vibe === "clean" || parsed.vibe === "polished"
          ? parsed.vibe
          : "relaxed",
      onboardingComplete: Boolean(parsed.onboardingComplete),
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePrefs(prefs: Prefs): void {
  if (!canUseBrowser()) return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function loadSavedLooks(): SavedLook[] {
  if (!canUseBrowser()) return [];
  try {
    const raw = localStorage.getItem(LOOKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedLook[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedLooks(looks: SavedLook[]): void {
  if (!canUseBrowser()) return;
  localStorage.setItem(LOOKS_KEY, JSON.stringify(looks));
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PIECES_STORE)) {
        db.createObjectStore(PIECES_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB failed"));
  });
}

export async function loadPieces(): Promise<Piece[]> {
  if (!canUseBrowser()) return [];
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(PIECES_STORE, "readonly");
      const req = tx.objectStore(PIECES_STORE).getAll();
      req.onsuccess = () => {
        const rows = (req.result as Piece[]) ?? [];
        rows.sort((a, b) => a.createdAt - b.createdAt);
        resolve(rows);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function putPiece(piece: Piece): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PIECES_STORE, "readwrite");
    tx.objectStore(PIECES_STORE).put(piece);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deletePiece(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PIECES_STORE, "readwrite");
    tx.objectStore(PIECES_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
