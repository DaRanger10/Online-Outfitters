import type {
  Dressy,
  Occasion,
  PieceColor,
  PieceType,
  SeasonFeel,
  TasteColor,
  Vibe,
} from "./types";

export const APP_NAME = "Online Outfitters";

export const DEFAULT_PREFS = {
  city: "",
  colors: [] as TasteColor[],
  mixItUp: false,
  vibe: "relaxed" as Vibe,
  onboardingComplete: false,
};

export const OCCASIONS: {
  id: Occasion;
  title: string;
  subtitle: string;
}[] = [
  { id: "casual", title: "Casual", subtitle: "Everyday" },
  { id: "work", title: "Work", subtitle: "The office" },
  { id: "nice", title: "Nice out", subtitle: "Dinner or a date" },
  { id: "workout", title: "Workout", subtitle: "Gym or a run" },
];

export const PIECE_TYPES: { id: PieceType; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "bottom", label: "Bottom" },
  { id: "shoes", label: "Shoes" },
  { id: "outerwear", label: "Outerwear" },
  { id: "other", label: "Other" },
];

export const CLOSET_FILTERS: { id: "all" | PieceType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "top", label: "Tops" },
  { id: "bottom", label: "Bottoms" },
  { id: "shoes", label: "Shoes" },
  { id: "outerwear", label: "Outerwear" },
  { id: "other", label: "Other" },
];

export const PIECE_COLORS: { id: PieceColor; label: string; hex: string }[] = [
  { id: "black", label: "Black", hex: "#1C1917" },
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "cream", label: "Cream", hex: "#F3E6C8" },
  { id: "gray", label: "Gray", hex: "#8A847C" },
  { id: "navy", label: "Navy", hex: "#1E3A5F" },
  { id: "blue", label: "Blue", hex: "#3B6FA0" },
  { id: "green", label: "Green", hex: "#3D6B4F" },
  { id: "red", label: "Red", hex: "#B4413A" },
  { id: "pink", label: "Pink", hex: "#D48BA0" },
  { id: "brown", label: "Brown", hex: "#6B4423" },
  { id: "pattern", label: "Pattern", hex: "#C4B8A8" },
];

export const TASTE_COLORS: { id: TasteColor; label: string; hex: string }[] = [
  { id: "black", label: "Black", hex: "#1C1917" },
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "cream", label: "Cream", hex: "#F3E6C8" },
  { id: "navy", label: "Navy", hex: "#1E3A5F" },
  { id: "blue", label: "Blue", hex: "#3B6FA0" },
  { id: "green", label: "Green", hex: "#3D6B4F" },
  { id: "red", label: "Red", hex: "#B4413A" },
  { id: "brown", label: "Brown", hex: "#6B4423" },
];

export const SEASONS: { id: SeasonFeel; label: string }[] = [
  { id: "warm", label: "Warm weather" },
  { id: "cool", label: "Cool weather" },
  { id: "anytime", label: "Anytime" },
];

export const DRESSY_OPTIONS: { id: Dressy; label: string }[] = [
  { id: "casual", label: "Casual" },
  { id: "smart", label: "Smart" },
  { id: "formal", label: "Formal" },
];

export const MIN_PIECES_TO_SUGGEST = 5;
export const NUDGE_UNDER = 8;

export function occasionTitle(id: Occasion): string {
  return OCCASIONS.find((o) => o.id === id)?.title ?? id;
}

export function typeLabel(type: PieceType): string {
  return PIECE_TYPES.find((t) => t.id === type)?.label ?? type;
}

export function colorLabel(color: PieceColor): string {
  return PIECE_COLORS.find((c) => c.id === color)?.label ?? color;
}

export function pieceDisplayName(piece: {
  nickname: string;
  color: PieceColor;
  type: PieceType;
}): string {
  const nick = piece.nickname.trim();
  if (nick) return nick;
  return `${colorLabel(piece.color)} ${piece.type}`;
}
