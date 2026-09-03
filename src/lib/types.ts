export type PieceType = "top" | "bottom" | "shoes" | "outerwear" | "other";

export type PieceColor =
  | "black"
  | "white"
  | "cream"
  | "gray"
  | "navy"
  | "blue"
  | "green"
  | "red"
  | "pink"
  | "brown"
  | "pattern";

export type TasteColor =
  | "black"
  | "white"
  | "cream"
  | "navy"
  | "blue"
  | "green"
  | "red"
  | "brown";

export type SeasonFeel = "warm" | "cool" | "anytime";
export type Dressy = "casual" | "smart" | "formal";
export type Vibe = "clean" | "relaxed" | "polished";
export type Occasion = "casual" | "work" | "nice" | "workout";
export type WeatherSeason = "warm" | "cool" | "mild";

export type Piece = {
  id: string;
  type: PieceType;
  color: PieceColor;
  season: SeasonFeel;
  dressy: Dressy;
  nickname: string;
  photo: string | null;
  createdAt: number;
};

export type Prefs = {
  city: string;
  colors: TasteColor[];
  mixItUp: boolean;
  vibe: Vibe;
  onboardingComplete: boolean;
};

export type WeatherInfo = {
  status: "ok" | "unavailable" | "no-city";
  displayName?: string;
  tempF?: number;
  description?: string;
  season: WeatherSeason;
  line: string;
};

export type LookItem = {
  id: string;
  type: PieceType;
  color: PieceColor;
  nickname: string;
  photo: string | null;
};

export type OutfitLook = {
  key: string;
  why: string;
  items: LookItem[];
  missing: PieceType | null;
};

export type SavedLook = {
  id: string;
  occasion: Occasion;
  createdAt: number;
  why: string;
  items: LookItem[];
  missing: PieceType | null;
};

export type Screen =
  | { name: "welcome" }
  | { name: "setup-taste" }
  | { name: "setup-pieces" }
  | { name: "home" }
  | { name: "closet" }
  | { name: "you" }
  | {
      name: "piece-form";
      pieceId?: string;
      presetType?: PieceType;
      returnTo?: Screen;
    }
  | { name: "outfit"; occasion: Occasion }
  | { name: "saved-looks" }
  | { name: "saved-look"; lookId: string };
