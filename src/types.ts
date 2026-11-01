export interface Bonsai {
  id: string;
  name: string;
  type: string; // e.g. "黒松 (Black Pine)", "紅葉 (Japanese Maple)", "真柏 (Sargent Juniper)", "桜 (Cherry Blossom)"
  level: number;
  experience: number;
  water: number; // 0 to 100
  fertilizer: number; // 0 to 100
  sunlight: "sunny" | "half-shade" | "shade";
  wind: "good" | "normal" | "poor";
  status: "healthy" | "dry" | "hungry" | "weak" | "withering";
  createdAt: string;
  lastWateredAt: string;
  lastFertilizedAt: string;
  history?: CareHistoryPoint[];
}

export interface CareHistoryPoint {
  date: string; // YYYY-MM-DD
  water: number; // 0 to 100
  fertilizer: number; // 0 to 100
  watered: boolean;
  fertilized: boolean;
}

export interface DiaryEntry {
  id: string;
  bonsaiId: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  sunlight: "sunny" | "half-shade" | "shade";
  wind: "good" | "normal" | "poor";
  watered: boolean;
  fertilized: boolean;
  aiComment: string;
  createdAt: string;
}

export interface BonsaiTypePreset {
  name: string;
  japaneseName: string;
  description: string;
  waterLossRate: number; // 1日（進めるボタン1回）あたりに減少する水分のデフォルト値
  fertilizerLossRate: number; // 1日（進めるボタン1回）あたりに減少する肥料のデフォルト値
  preferredSunlight: "sunny" | "half-shade" | "shade";
  preferredWind: "good" | "normal" | "poor";
  imagePrompt: string; // 画像生成用、または美しいSVG表現のためのキーワード
  color: string; // テーマカラー
}
