import { pieceDisplayName } from "./constants";
import type {
  Dressy,
  Occasion,
  OutfitLook,
  Piece,
  PieceColor,
  PieceType,
  Prefs,
  WeatherSeason,
} from "./types";

const NEUTRALS: PieceColor[] = [
  "black",
  "white",
  "cream",
  "gray",
  "navy",
  "brown",
];

const OCCASION_OK: Record<Occasion, Dressy[]> = {
  casual: ["casual"],
  work: ["smart", "casual"],
  nice: ["smart", "formal"],
  workout: ["casual"],
};

const OCCASION_BEST: Record<Occasion, Dressy> = {
  casual: "casual",
  work: "smart",
  nice: "smart",
  workout: "casual",
};

function isNeutral(color: PieceColor): boolean {
  return NEUTRALS.includes(color);
}

function seasonFits(item: Piece, weather: WeatherSeason): boolean {
  if (item.season === "anytime") return true;
  if (weather === "mild") return true;
  return item.season === weather;
}

function formalityFits(item: Piece, occasion: Occasion, loose: boolean): boolean {
  if (loose) return true;
  return OCCASION_OK[occasion].includes(item.dressy);
}

function scoreItem(
  item: Piece,
  prefs: Prefs,
  weather: WeatherSeason,
  occasion: Occasion,
): number {
  let score = 0;
  if (prefs.colors.includes(item.color as (typeof prefs.colors)[number])) {
    score += 12;
  }
  if (item.dressy === OCCASION_BEST[occasion]) score += 10;
  else if (OCCASION_OK[occasion].includes(item.dressy)) score += 4;

  if (item.season === weather) score += 8;
  else if (item.season === "anytime") score += 3;

  if (!prefs.mixItUp && isNeutral(item.color)) score += 6;
  if (prefs.mixItUp && !isNeutral(item.color) && item.color !== "pattern") {
    score += 6;
  }

  if (prefs.vibe === "clean") {
    if (isNeutral(item.color) && item.color !== "pattern") score += 4;
    if (item.color === "pattern") score -= 4;
  }
  if (prefs.vibe === "polished" && item.dressy !== "casual") score += 4;
  if (prefs.vibe === "relaxed" && item.dressy === "casual") score += 4;

  return score;
}

function pairScore(a: Piece, b: Piece, mixItUp: boolean): number {
  if (a.color === b.color) return mixItUp ? 2 : 8;
  const bothNeutral = isNeutral(a.color) && isNeutral(b.color);
  if (bothNeutral) return mixItUp ? 4 : 7;
  if (isNeutral(a.color) || isNeutral(b.color)) return 6;
  if (a.color !== b.color) return mixItUp ? 9 : 3;
  return 5;
}

function rank(
  items: Piece[],
  prefs: Prefs,
  weather: WeatherSeason,
  occasion: Occasion,
): Piece[] {
  return [...items].sort((a, b) => {
    const diff =
      scoreItem(b, prefs, weather, occasion) -
      scoreItem(a, prefs, weather, occasion);
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });
}

function pickPartner(
  pool: Piece[],
  anchors: Piece[],
  usedIds: Set<string>,
  mixItUp: boolean,
  avoidId?: string,
): Piece | undefined {
  const candidates = pool.filter(
    (p) => !usedIds.has(p.id) && p.id !== avoidId,
  );
  if (candidates.length === 0) {
    return pool.find((p) => p.id !== avoidId) ?? pool[0];
  }
  let best = candidates[0];
  let bestScore = -Infinity;
  for (const item of candidates) {
    const paired = anchors.reduce(
      (sum, a) => sum + pairScore(a, item, mixItUp),
      0,
    );
    if (paired > bestScore) {
      bestScore = paired;
      best = item;
    }
  }
  return best;
}

function toLookItem(piece: Piece) {
  return {
    id: piece.id,
    type: piece.type,
    color: piece.color,
    nickname: pieceDisplayName(piece),
    photo: piece.photo,
  };
}

function missingFor(items: Piece[]): PieceType | null {
  const types = new Set(items.map((i) => i.type));
  if (!types.has("top")) return "top";
  if (!types.has("bottom")) return "bottom";
  if (!types.has("shoes")) return "shoes";
  return null;
}

function missingLabel(type: PieceType): string {
  if (type === "shoes") return "Add shoes to complete this";
  if (type === "top") return "Add a top to complete this";
  if (type === "bottom") return "Add a bottom to complete this";
  if (type === "outerwear") return "Add a layer to complete this";
  return "Add something to complete this";
}

export function missingPrompt(type: PieceType | null): string | null {
  if (!type) return null;
  return missingLabel(type);
}

function whyLine(args: {
  occasion: Occasion;
  weather: WeatherSeason;
  mixItUp: boolean;
  hasOuterwear: boolean;
  contrast: boolean;
  index: number;
}): string {
  if (args.occasion === "workout") return "You'll actually move in this";
  if (args.occasion === "nice") return "Fine for dinner, not overdone";
  if (args.occasion === "work") return "Works for the office without a suit";
  if (args.weather === "cool" && args.hasOuterwear) {
    return "Cool enough for a layer";
  }
  if (args.weather === "warm") return "Warm day, keep it easy";
  if (args.mixItUp && args.contrast) return "A little more contrast than usual.";
  if (args.index > 0 && args.mixItUp) return "A little more contrast than usual.";
  return "Familiar combo, on purpose";
}

function hasContrast(items: Piece[]): boolean {
  const colors = items.map((i) => i.color);
  const distinct = new Set(colors);
  if (distinct.size < 2) return false;
  const nonNeutral = colors.filter((c) => !isNeutral(c) && c !== "pattern");
  return nonNeutral.length > 0 || distinct.size >= 3;
}

function eligible(
  pieces: Piece[],
  occasion: Occasion,
  weather: WeatherSeason,
  loose: boolean,
): Piece[] {
  return pieces.filter(
    (p) => seasonFits(p, weather) && formalityFits(p, occasion, loose),
  );
}

export function suggestOutfits(
  pieces: Piece[],
  prefs: Prefs,
  occasion: Occasion,
  weather: WeatherSeason,
): OutfitLook[] {
  if (pieces.length === 0) return [];

  let pool = eligible(pieces, occasion, weather, false);
  if (pool.length < 2) {
    pool = eligible(pieces, occasion, weather, true);
  }
  if (pool.length === 0) pool = [...pieces];

  const tops = rank(
    pool.filter((p) => p.type === "top"),
    prefs,
    weather,
    occasion,
  );
  const bottoms = rank(
    pool.filter((p) => p.type === "bottom"),
    prefs,
    weather,
    occasion,
  );
  const shoes = rank(
    pool.filter((p) => p.type === "shoes"),
    prefs,
    weather,
    occasion,
  );
  const outerwear = rank(
    pool.filter((p) => p.type === "outerwear"),
    prefs,
    weather,
    occasion,
  );
  const others = rank(
    pool.filter((p) => p.type === "other"),
    prefs,
    weather,
    occasion,
  );

  const leads =
    tops.length > 0
      ? tops
      : occasion === "workout" && others.length > 0
        ? others
        : bottoms.length > 0
          ? bottoms
          : shoes.length > 0
            ? shoes
            : pool.slice(0, 3);

  const looks: OutfitLook[] = [];
  const usedKeys = new Set<string>();

  for (let i = 0; i < leads.length && looks.length < 3; i++) {
    const lead = leads[i];
    const used = new Set<string>([lead.id]);
    const chosen: Piece[] = [lead];

    const needBottom = lead.type !== "bottom";
    const needTop = lead.type !== "top" && tops.length > 0 && lead.type !== "other";

    if (needTop && !chosen.some((c) => c.type === "top") && tops.length) {
      const top = pickPartner(tops, chosen, used, prefs.mixItUp, lead.id);
      if (top) {
        chosen.push(top);
        used.add(top.id);
      }
    }

    if (needBottom && bottoms.length) {
      const bottom = pickPartner(bottoms, chosen, used, prefs.mixItUp);
      if (bottom) {
        chosen.push(bottom);
        used.add(bottom.id);
      }
    }

    if (shoes.length) {
      const shoe = pickPartner(shoes, chosen, used, prefs.mixItUp);
      if (shoe) {
        chosen.push(shoe);
        used.add(shoe.id);
      }
    }

    if (weather === "cool" && outerwear.length) {
      const layer = pickPartner(outerwear, chosen, used, prefs.mixItUp);
      if (layer) {
        chosen.push(layer);
        used.add(layer.id);
      }
    }

    if (
      occasion === "workout" &&
      others.length &&
      !chosen.some((c) => c.type === "other")
    ) {
      const extra = pickPartner(others, chosen, used, prefs.mixItUp, lead.id);
      if (extra && !used.has(extra.id)) chosen.push(extra);
    }

    const unique = chosen.filter(
      (item, idx, arr) => arr.findIndex((x) => x.id === item.id) === idx,
    );
    const order: PieceType[] = ["top", "bottom", "shoes", "outerwear", "other"];
    unique.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

    const key = unique
      .map((p) => p.id)
      .sort()
      .join("+");
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);

    const missing = missingFor(unique);
    looks.push({
      key,
      why: whyLine({
        occasion,
        weather,
        mixItUp: prefs.mixItUp,
        hasOuterwear: unique.some((p) => p.type === "outerwear"),
        contrast: hasContrast(unique),
        index: looks.length,
      }),
      items: unique.map(toLookItem),
      missing,
    });
  }

  return looks;
}
