import { BonsaiTypePreset } from "../types";

export const BONSAI_PRESETS: BonsaiTypePreset[] = [
  {
    name: "black_pine",
    japaneseName: "黒松 (Black Pine)",
    description: "盆栽の王道。非常に頑丈で、太陽の光と心地よい風を何よりも好みます。乾燥には強いですが、過湿には注意が必要です。",
    waterLossRate: 15, // 1回の日数経過で減少する水分%
    fertilizerLossRate: 10, // 1回の日数経過で減少する肥料%
    preferredSunlight: "sunny",
    preferredWind: "good",
    imagePrompt: "Japanese black pine bonsai rugged formal upright style",
    color: "emerald"
  },
  {
    name: "japanese_maple",
    japaneseName: "紅葉 (Japanese Maple)",
    description: "季節の移ろいを感じる美しい葉が特徴。水切れ（乾燥）に非常に弱く、強い直射日光は葉焼けの原因になるため半日陰を好みます。",
    waterLossRate: 25, // 水の減りが早い
    fertilizerLossRate: 12,
    preferredSunlight: "half-shade",
    preferredWind: "normal",
    imagePrompt: "Japanese maple bonsai autumn colors red orange leaves",
    color: "rose"
  },
  {
    name: "juniper",
    japaneseName: "真柏 (Sargent Juniper)",
    description: "うねる幹と、白い木肌（シャリ・神）が織りなす芸術的な姿。日光と風通しが大好きで、お世話のやりがいがあります。",
    waterLossRate: 18,
    fertilizerLossRate: 8,
    preferredSunlight: "sunny",
    preferredWind: "good",
    imagePrompt: "Sargent juniper bonsai shimpaku windy twisted trunk style",
    color: "teal"
  },
  {
    name: "cherry_blossom",
    japaneseName: "旭山桜 (Cherry Blossom)",
    description: "春に可憐なピンクの花を咲かせる人気の品種。花を咲かせるためにたくさんの水分と十分な日光、そして適度な肥料を必要とします。",
    waterLossRate: 22,
    fertilizerLossRate: 15, // 肥料喰い
    preferredSunlight: "sunny",
    preferredWind: "normal",
    imagePrompt: "Miniature cherry blossom bonsai blooming pink flowers",
    color: "pink"
  }
];

export const SUNLIGHT_LABELS = {
  sunny: { label: "日向（たっぷり日光）", color: "bg-amber-100 text-amber-800 border-amber-200" },
  "half-shade": { label: "半日陰（木漏れ日）", color: "bg-orange-50 text-orange-800 border-orange-200" },
  shade: { label: "日陰（遮光環境）", color: "bg-slate-100 text-slate-800 border-slate-200" }
};

export const WIND_LABELS = {
  good: { label: "良好（そよ風）", color: "bg-sky-100 text-sky-800 border-sky-200" },
  normal: { label: "普通（室内/窓際）", color: "bg-slate-100 text-slate-800 border-slate-200" },
  poor: { label: "悪い（空気が滞る）", color: "bg-red-50 text-red-800 border-red-150" }
};
