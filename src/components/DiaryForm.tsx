import React, { useState, useEffect } from "react";
import { BookOpen, Droplets, Flame, Sun, Wind, Send, Sparkles } from "lucide-react";
import { Bonsai } from "../types";

interface DiaryFormProps {
  bonsai: Bonsai;
  onSubmit: (data: {
    title: string;
    content: string;
    sunlight: "sunny" | "half-shade" | "shade";
    wind: "good" | "normal" | "poor";
    watered: boolean;
    fertilized: boolean;
  }) => Promise<void>;
}

export default function DiaryForm({ bonsai, onSubmit }: DiaryFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sunlight, setSunlight] = useState<"sunny" | "half-shade" | "shade">(bonsai.sunlight);
  const [wind, setWind] = useState<"good" | "normal" | "poor">(bonsai.wind);
  const [watered, setWatered] = useState(false);
  const [fertilized, setFertilized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state when selected bonsai changes
  useEffect(() => {
    setSunlight(bonsai.sunlight);
    setWind(bonsai.wind);
    setTitle("");
    setContent("");
    setWatered(false);
    setFertilized(false);
  }, [bonsai.id, bonsai.sunlight, bonsai.wind]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        title: title.trim() || "今日のお世話記録",
        content: content.trim(),
        sunlight,
        wind,
        watered,
        fertilized,
      });
      // Reset form
      setTitle("");
      setContent("");
      setWatered(false);
      setFertilized(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="diary-form-card" className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">お世話日記をつける</h3>
          <p className="text-xs text-slate-500">
            「{bonsai.name}」の環境管理を記録し、AIマスターに相談しましょう。
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Environment Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sunlight (日当たり) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sun className="w-4 h-4 text-amber-500" /> 日当たりの管理
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
              {(["sunny", "half-shade", "shade"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSunlight(mode)}
                  className={`py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    sunlight === mode
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {mode === "sunny" ? "日向" : mode === "half-shade" ? "半日陰" : "日陰"}
                </button>
              ))}
            </div>
          </div>

          {/* Wind (風通し) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Wind className="w-4 h-4 text-sky-500" /> 風通しの管理
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
              {(["good", "normal", "poor"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setWind(mode)}
                  className={`py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    wind === mode
                      ? "bg-sky-500 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {mode === "good" ? "良好" : mode === "normal" ? "普通" : "悪い"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Toggles (水やり・肥料) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Water toggle button */}
          <button
            type="button"
            onClick={() => setWatered(!watered)}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
              watered
                ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/10"
                : "bg-white text-slate-600 border-slate-200 hover:border-sky-300"
            }`}
          >
            <Droplets className={`w-4 h-4 ${watered ? "animate-bounce" : ""}`} />
            水やりをする {watered && "✓"}
          </button>

          {/* Fertilizer toggle button */}
          <button
            type="button"
            onClick={() => setFertilized(!fertilized)}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
              fertilized
                ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/10"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}
          >
            <Flame className={`w-4 h-4 ${fertilized ? "animate-pulse" : ""}`} />
            肥料をあげる {fertilized && "✓"}
          </button>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="日記のタイトル（例: 初めての剪定、新芽が出た）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-700 transition-all placeholder:text-slate-400"
          />
          <textarea
            placeholder="本日の様子、気づいたこと、心配事などを書いて、AI盆栽マスターからアドバイスをもらいましょう..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-700 transition-all placeholder:text-slate-400"
          />
        </div>

        <button
          id="submit-diary-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-emerald-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-emerald-200" />
              盆栽マスターが助言を考案中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              日記を保存してアドバイスをもらう
            </>
          )}
        </button>
      </form>
    </div>
  );
}
