import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with lazy check to avoid crashing if API key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY is not configured or still template value. AI Bonsai advice will fallback to simulated master responses.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Simulated fallback advice when API key is missing
function getSimulatedAdvice(bonsaiType: string, status: { water: number; fertilizer: number; sunlight: string; wind: string }, diaryText: string) {
  const advices = [
    `盆栽マスターより：おや、${bonsaiType}の様子をよく見ておるな。風通しが「${status.wind === "good" ? "良好" : "少し不足"}」なのは重要なポイントじゃ。水やりや肥料もタイミングを逃さぬよう、この調子で愛情を注いであげると、きっと見事な枝ぶりに育つぞ。`,
    `盆栽マスターより：${bonsaiType}の生命力を感じる日記じゃな。日当たり「${status.sunlight === "sunny" ? "日向" : status.sunlight === "half-shade" ? "半日陰" : "日陰"}」は今の季節に合っておる。特に、葉が乾きすぎないように水分量（現在${status.water}%）をよく見極めることが、美しい緑を保つ秘訣じゃ。`,
    `盆栽マスターより：よく記録をつけたな。盆栽との対話は、毎日の観察から始まるのじゃ。${bonsaiType}は環境の変化に敏感ゆえ、風通しや日当たりを日々調整してやるのが、名匠への第一歩。引き続き楽しんでまいろう。`
  ];
  return advices[Math.floor(Math.random() * advices.length)] + (diaryText ? " （日記から愛情が伝わってきますぞ！）" : "");
}

// API endpoint for AI Bonsai Master Advice
app.post("/api/gemini/advice", async (req, res) => {
  try {
    const { bonsaiName, bonsaiType, water, fertilizer, sunlight, wind, diaryTitle, diaryContent, watered, fertilized } = req.body;

    const ai = getAiClient();
    if (!ai) {
      // Return simulated advice
      const advice = getSimulatedAdvice(bonsaiType || "盆栽", { water: water || 50, fertilizer: fertilizer || 50, sunlight: sunlight || "sunny", wind: wind || "good" }, `${diaryTitle || ""} ${diaryContent || ""}`);
      return res.json({ advice });
    }

    const prompt = `
あなたは由緒ある「盆栽マスター（盆栽の達人、老人風の温かくユーモアのある口調）」です。
ユーザーが育てているデジタル盆栽について、現在の状態と今日のケア日記を読んで、プロとしての評価、アドバイス、温かい励ましを日本語で200字程度で述べてください。

盆栽情報:
- 名前: ${bonsaiName || "名無し"}
- 品種: ${bonsaiType || "一般的な盆栽"}
- 現在の水分量: ${water}% (0%で枯れる, 100%で満タン)
- 肥料状態: ${fertilizer}% (0%で栄養不足, 100%で満タン)
- 本日の配置環境（日当たり）: ${sunlight === "sunny" ? "日向（たっぷり日光）" : sunlight === "half-shade" ? "半日陰（木漏れ日）" : "日陰（遮光）"}
- 本日の配置環境（風通し）: ${wind === "good" ? "良好（そよ風が通る）" : wind === "normal" ? "普通" : "悪い（空気が滞っている）"}

本日のお世話アクション:
- 水やりを行ったか: ${watered ? "はい" : "いいえ"}
- 肥料を与えたか: ${fertilized ? "はい" : "いいえ"}

本日の日記:
- タイトル: "${diaryTitle || "無題"}"
- 本文: "${diaryContent || "（日記の本文はありません。お世話のみ行いました。）"}"

返答のトーン:
- 「〜じゃ」「〜のう」「〜ぞ」といった優しく博識な盆栽老人の口調。
- ユーザーを褒め、盆栽への愛情をさらに深められるようなアドバイスにしてください。
- 盆栽の種類（松、桜、楓、梅など）に合わせた一言（例: 松なら「じっくりと耐え忍ぶ美」、桜なら「春の蕾への期待」など）を盛り込むと最高です。
- 文字数は150字〜250字程度で。Markdownは使わずプレーンテキストにしてください。
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const adviceText = response.text || "盆栽の様子をよく見ておるな。この調子で大切に育てておくれ。";
    res.json({ advice: adviceText.trim() });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "アドバイスの生成に失敗しました。シミュレートされたアドバイスを代わりに使用してください。", details: error.message });
  }
});

// Start Vite dev server or static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bonsai Server running on http://localhost:${PORT}`);
  });
}

startServer();
